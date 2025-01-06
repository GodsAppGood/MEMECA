import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Meme } from "@/types/meme";

interface FormData {
  title: string;
  description: string;
  blockchain: string;
  twitter_link: string;
  telegram_link: string;
  trade_link: string;
  image_url: string;
  created_by: string;
  created_at: string;
  time_until_listing: string;
}

export const useFormSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmission = async (
    formData: FormData,
    isEditMode: boolean,
    memeId?: number | string
  ) => {
    setIsSubmitting(true);

    try {
      console.log(`${isEditMode ? 'Updating' : 'Creating'} meme with data:`, formData);

      if (isEditMode) {
        if (!memeId) {
          throw new Error('Cannot update meme - missing meme ID');
        }

        const { error: updateError } = await supabase
          .from('Memes')
          .update(formData)
          .eq('id', memeId)
          .select()
          .single();

        if (updateError) {
          throw updateError;
        }

        toast({
          title: "Success!",
          description: "Your meme has been updated successfully.",
        });
      } else {
        const { error: insertError } = await supabase
          .from('Memes')
          .insert([formData])
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        toast({
          title: "Success!",
          description: "Your meme has been submitted successfully.",
        });
      }

      await queryClient.invalidateQueries({ queryKey: ["memes"] });
      navigate("/my-memes");
    } catch (error: any) {
      console.error(`Error ${isEditMode ? 'updating' : 'submitting'} meme:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || (isEditMode ? "Failed to update meme" : "Failed to submit meme"),
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }

    return true;
  };

  return { handleSubmission, isSubmitting };
};