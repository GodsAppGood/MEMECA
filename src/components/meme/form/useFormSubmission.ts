import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface FormData {
  title: string;
  description: string;
  blockchain: string;
  twitter_link: string | null;
  telegram_link: string | null;
  trade_link: string | null;
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
    console.log(`Operation mode: ${isEditMode ? 'Edit' : 'Create'}, Meme ID: ${memeId}`);

    try {
      if (isEditMode) {
        if (!memeId) {
          throw new Error('Cannot update meme - missing meme ID');
        }

        // Get current meme data to compare changes
        const { data: currentMeme, error: fetchError } = await supabase
          .from('Memes')
          .select('*')
          .eq('id', memeId)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        // Check if any changes were made
        const hasChanges = Object.keys(formData).some(key => 
          formData[key as keyof FormData] !== currentMeme[key as keyof FormData]
        );

        if (!hasChanges) {
          toast({
            title: "No Changes",
            description: "No changes were detected in the form.",
          });
          return true;
        }

        const { error: updateError } = await supabase
          .from('Memes')
          .update(formData)
          .eq('id', memeId);

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
          .insert([formData]);

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
      return true;
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
  };

  return { handleSubmission, isSubmitting };
};