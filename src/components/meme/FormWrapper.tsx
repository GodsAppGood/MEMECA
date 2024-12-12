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
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
    
    if (!imageUrl) {
      toast({
        title: "Error",
        description: "Please upload an image.",
        variant: "destructive"
      });
      return;
    }

    try {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("You must be logged in to submit a meme");
      }

      const memeData = {
        title,
        description,
        blockchain,
        date: date ? format(date, "PPP") : null,
        twitter_link: twitterLink || null,
        telegram_link: telegramLink || null,
        trade_link: tradeLink || null,
        image_url: imageUrl,
        created_by: user.id,
      };

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

        if (insertError) throw insertError;
      }

      await queryClient.invalidateQueries({ queryKey: ["memes"] });
      
      toast({
        title: "Success!",
        description: isEditing ? "Your meme has been updated successfully." : "Your meme has been submitted successfully.",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error('Error submitting meme:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit meme",
        variant: "destructive"
      });
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

        <SubmitButton isEditing={isEditing} />
      </div>
    </form>
  );
};