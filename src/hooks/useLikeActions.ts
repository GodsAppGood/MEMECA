import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useLikeActions = (memeId: string, userId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLike = async () => {
    if (!userId) {
      console.log("No user ID provided");
      throw new Error("Please login to like memes");
    }

    if (isProcessing) {
      console.log("Already processing a like action");
      return;
    }

    try {
      setIsProcessing(true);
      console.log("Adding like for meme:", memeId, "by user:", userId);

      const { data: existingLike, error: checkError } = await supabase
        .from('Likes')
        .select('id')
        .eq('user_id', userId)
        .eq('meme_id', Number(memeId))
        .maybeSingle();

      if (checkError) {
        console.error("Error checking existing like:", checkError);
        throw checkError;
      }

      if (existingLike) {
        console.log("Meme already liked");
        return;
      }

      const { error: insertError } = await supabase
        .from('Likes')
        .insert([{ 
          user_id: userId, 
          meme_id: Number(memeId)
        }]);

      if (insertError) {
        console.error("Error adding like:", insertError);
        throw insertError;
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["memes"] }),
        queryClient.invalidateQueries({ queryKey: ["user-likes"] })
      ]);

      console.log("Like added successfully");
    } catch (error: any) {
      console.error("Error in handleLike:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnlike = async () => {
    if (!userId) {
      console.log("No user ID provided");
      throw new Error("Please login to unlike memes");
    }

    if (isProcessing) {
      console.log("Already processing an unlike action");
      return;
    }

    try {
      setIsProcessing(true);
      console.log("Removing like for meme:", memeId, "by user:", userId);

      const { error: deleteError } = await supabase
        .from('Likes')
        .delete()
        .eq('user_id', userId)
        .eq('meme_id', Number(memeId));

      if (deleteError) {
        console.error("Error removing like:", deleteError);
        throw deleteError;
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["memes"] }),
        queryClient.invalidateQueries({ queryKey: ["user-likes"] })
      ]);

      console.log("Like removed successfully");
    } catch (error: any) {
      console.error("Error in handleUnlike:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleLike,
    handleUnlike,
    isProcessing
  };
};