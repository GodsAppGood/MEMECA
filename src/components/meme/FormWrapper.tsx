import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { FormHeader } from "./form/FormHeader";
import { FormBody } from "./form/FormBody";
import { FormFooter } from "./form/FormFooter";
import { Meme } from "@/types/meme";

export interface FormWrapperProps {
  onSubmitAttempt: () => void;
  isAuthenticated: boolean;
  initialData?: Partial<Meme>;
  isEditMode?: boolean;
}

export const FormWrapper = ({ 
  onSubmitAttempt, 
  isAuthenticated,
  initialData,
  isEditMode = false
}: FormWrapperProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [blockchain, setBlockchain] = useState(initialData?.blockchain || "");
  const [createdAt, setCreatedAt] = useState<Date>();
  const [twitterLink, setTwitterLink] = useState(initialData?.twitter_link || "");
  const [telegramLink, setTelegramLink] = useState(initialData?.telegram_link || "");
  const [tradeLink, setTradeLink] = useState(initialData?.trade_link || "");
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setBlockchain(initialData.blockchain || "");
      setTwitterLink(initialData.twitter_link || "");
      setTelegramLink(initialData.telegram_link || "");
      setTradeLink(initialData.trade_link || "");
      setImageUrl(initialData.image_url || "");
    }
  }, [initialData]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current session:", session);
      setUser(session?.user || null);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === 'SIGNED_OUT') {
        navigate('/');
      }
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      console.log("User not authenticated");
      onSubmitAttempt();
      return;
    }

    if (!imageUrl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload an image.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting meme with user ID:", user.id);
      const memeData = {
        title,
        description,
        blockchain,
        twitter_link: twitterLink || null,
        telegram_link: telegramLink || null,
        trade_link: tradeLink || null,
        image_url: imageUrl,
        created_by: user.id,
        created_at: createdAt?.toISOString() || new Date().toISOString(),
        time_until_listing: createdAt?.toISOString() || new Date().toISOString()
      };

      console.log("Meme data to submit:", memeData);

      if (isEditMode && initialData?.id) {
        const { error: updateError } = await supabase
          .from('Memes')
          .update(memeData)
          .eq('id', initialData.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('Memes')
          .insert([memeData]);

        if (insertError) throw insertError;
      }

      await queryClient.invalidateQueries({ queryKey: ["memes"] });
      
      toast({
        title: "Success!",
        description: isEditMode ? "Your meme has been updated successfully." : "Your meme has been submitted successfully.",
      });
      
      navigate("/my-memes");
    } catch (error: any) {
      console.error('Error submitting meme:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit meme",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <FormHeader isEditing={isEditMode} />
      
      <FormBody
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        blockchain={blockchain}
        setBlockchain={setBlockchain}
        createdAt={createdAt}
        setCreatedAt={setCreatedAt}
        twitterLink={twitterLink}
        setTwitterLink={setTwitterLink}
        telegramLink={telegramLink}
        setTelegramLink={setTelegramLink}
        tradeLink={tradeLink}
        setTradeLink={setTradeLink}
      />
      
      <FormFooter 
        isEditing={isEditMode} 
        isSubmitting={isSubmitting} 
      />
    </form>
  );
};