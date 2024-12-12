import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ImageUploader } from "./ImageUploader";
import { FormFields } from "./FormFields";
import { BlockchainSelector } from "./BlockchainSelector";
import { DateSelector } from "./DateSelector";
import { SubmitButton } from "./SubmitButton";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

const MAX_DESCRIPTION_LENGTH = 200;

export const FormWrapper = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [blockchain, setBlockchain] = useState("");
  const [date, setDate] = useState<Date>();
  const [twitterLink, setTwitterLink] = useState("");
  const [telegramLink, setTelegramLink] = useState("");
  const [tradeLink, setTradeLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check and set authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (!currentSession) {
          toast({
            title: "Authentication Required",
            description: "Please log in to submit memes.",
            variant: "destructive"
          });
          navigate("/");
          return;
        }

        setSession(currentSession);
        console.log("Current session:", currentSession); // Debug log

        // Verify user exists in Users table
        const { data: userData, error: userError } = await supabase
          .from('Users')
          .select('*')
          .eq('auth_id', currentSession.user.id)
          .single();

        if (userError && userError.code !== 'PGRST116') {
          console.error('User data error:', userError);
          throw userError;
        }

        // If user doesn't exist in Users table, create them
        if (!userData) {
          const { error: insertError } = await supabase
            .from('Users')
            .insert([
              {
                auth_id: currentSession.user.id,
                email: currentSession.user.email,
                name: currentSession.user.user_metadata?.name,
                profile_image: currentSession.user.user_metadata?.picture
              }
            ]);

          if (insertError) {
            console.error('User creation error:', insertError);
            throw insertError;
          }
        }
      } catch (error: any) {
        console.error('Auth check error:', error);
        toast({
          title: "Authentication Error",
          description: error.message || "Please try logging in again.",
          variant: "destructive"
        });
        navigate("/");
      }
    };

    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session); // Debug log
      if (event === 'SIGNED_OUT') {
        navigate("/");
      }
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  useEffect(() => {
    const editingMeme = localStorage.getItem("editingMeme");
    if (editingMeme) {
      const meme = JSON.parse(editingMeme);
      setTitle(meme.title);
      setDescription(meme.description);
      setBlockchain(meme.blockchain);
      setDate(meme.date ? new Date(meme.date) : undefined);
      setTwitterLink(meme.twitterLink || "");
      setTelegramLink(meme.telegramLink || "");
      setTradeLink(meme.tradeLink || "");
      setImageUrl(meme.imageUrl);
      setIsEditing(true);
      setEditingId(meme.id);
      localStorage.removeItem("editingMeme");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!imageUrl) {
      toast({
        title: "Error",
        description: "Please upload an image.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit memes.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      console.log("Submitting meme with user ID:", session.user.id); // Debug log

      const memeData = {
        title,
        description,
        blockchain,
        date: date ? format(date, "PPP") : null,
        twitter_link: twitterLink || null,
        telegram_link: telegramLink || null,
        trade_link: tradeLink || null,
        image_url: imageUrl,
        created_by: session.user.id,
      };

      console.log("Meme data to be submitted:", memeData); // Debug log

      if (isEditing && editingId) {
        const { error: updateError } = await supabase
          .from('Memes')
          .update(memeData)
          .eq('id', editingId);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('Memes')
          .insert([memeData]);

        if (insertError) {
          console.error('Insert error:', insertError); // Debug log
          throw insertError;
        }
      }

      await queryClient.invalidateQueries({ queryKey: ["memes"] });
      
      toast({
        title: "Success!",
        description: isEditing ? "Your meme has been updated successfully." : "Your meme has been submitted successfully.",
      });
      
      navigate("/my-memes");
    } catch (error: any) {
      console.error('Error submitting meme:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit meme",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <ImageUploader imageUrl={imageUrl} onImageChange={setImageUrl} />
      </div>

      <div className="space-y-6">
        <FormFields
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          maxDescriptionLength={MAX_DESCRIPTION_LENGTH}
          tradeLink={tradeLink}
          setTradeLink={setTradeLink}
          twitterLink={twitterLink}
          setTwitterLink={setTwitterLink}
          telegramLink={telegramLink}
          setTelegramLink={setTelegramLink}
        />

        <BlockchainSelector
          blockchain={blockchain}
          setBlockchain={setBlockchain}
        />

        <DateSelector
          date={date}
          setDate={setDate}
        />

        <SubmitButton isEditing={isEditing} isLoading={isLoading} />
      </div>
    </form>
  );
};