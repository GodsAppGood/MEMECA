import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
    memeId?: string | number | null
  ) => {
    setIsSubmitting(true);
    console.log("Form submission:", { isEditMode, memeId, formData });

    try {
      if (isEditMode) {
        if (!memeId) {
          throw new Error('Cannot update meme - missing meme ID');
        }

        const numericId = typeof memeId === 'string' ? parseInt(memeId, 10) : memeId;

        // Get current meme data
        const { data: currentMeme, error: fetchError } = await supabase
          .from('Memes')
          .select('*')
          .eq('id', numericId)
          .single();

        if (fetchError) {
          console.error('Error fetching current meme:', fetchError);
          throw fetchError;
        }

        // Compare and only update changed fields
        const updatedFields = Object.entries(formData).reduce((acc, [key, value]) => {
          if (value !== currentMeme[key]) {
            acc[key] = value;
          }
          return acc;
        }, {} as Partial<FormData>);

        console.log("Fields to update:", updatedFields);

        if (Object.keys(updatedFields).length === 0) {
          toast({
            title: "No Changes",
            description: "No changes were detected in the form.",
          });
          return true;
        }

        const { error: updateError } = await supabase
          .from('Memes')
          .update(updatedFields)
          .eq('id', numericId);

        if (updateError) {
          console.error('Error updating meme:', updateError);
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
          console.error('Error creating meme:', insertError);
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