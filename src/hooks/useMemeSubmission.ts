import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MemeData {
  title: string;
  description: string;
  blockchain: string;
  date: Date | undefined;
  twitter_link: string;
  telegram_link: string;
  trade_link: string;
  image_url: string;
  created_by: string;
}

export const useMemeSubmission = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitMeme = async (memeData: MemeData, isEditing: boolean = false, editingId?: string | null) => {
    setIsLoading(true);
    try {
      console.log("Submitting meme with data:", memeData);

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
          console.error('Insert error:', insertError);
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

  return { submitMeme, isLoading };
};