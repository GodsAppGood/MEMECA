import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const useLikeActions = (memeId: string | number, userId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLike = async () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to like memes",
        variant: "destructive",
      });
      return;
    }

    if (isProcessing) return;

    const id = typeof memeId === 'string' ? parseInt(memeId) : memeId;
    if (isNaN(id)) {
      console.error("Invalid meme ID:", memeId);
      return;
    }

    try {
      setIsProcessing(true);

      const { error: insertError } = await supabase
        .from("Likes")
        .insert([{ 
          user_id: userId, 
          meme_id: id 
        }]);

      if (insertError) {
        if (insertError.code === '23505') {
          toast({
            title: "Already liked",
            description: "You have already liked this meme",
            variant: "destructive",
          });
          return;
        }
        throw insertError;
      }
      
      // Invalidate relevant queries to trigger updates
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["memes"] }),
        queryClient.invalidateQueries({ queryKey: ["top-memes"] }),
        queryClient.invalidateQueries({ queryKey: ["watchlist-memes"] }),
        queryClient.invalidateQueries({ queryKey: ["featured-memes"] }),
        queryClient.invalidateQueries({ queryKey: ["user-likes"] })
      ]);

      toast({
        title: "Success",
        description: "Meme liked successfully",
      });
    } catch (error: any) {
      console.error("Error liking meme:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to like meme",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnlike = async () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to unlike memes",
        variant: "destructive",
      });
      return;
    }

    if (isProcessing) return;

    const id = typeof memeId === 'string' ? parseInt(memeId) : memeId;
    if (isNaN(id)) {
      console.error("Invalid meme ID:", memeId);
      return;
    }

    try {
      setIsProcessing(true);

      const { error: deleteError } = await supabase
        .from("Likes")
        .delete()
        .eq("user_id", userId)
        .eq("meme_id", id);

      if (deleteError) throw deleteError;
      
      // Invalidate relevant queries to trigger updates
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["memes"] }),
        queryClient.invalidateQueries({ queryKey: ["top-memes"] }),
        queryClient.invalidateQueries({ queryKey: ["watchlist-memes"] }),
        queryClient.invalidateQueries({ queryKey: ["featured-memes"] }),
        queryClient.invalidateQueries({ queryKey: ["user-likes"] })
      ]);

      toast({
        title: "Success",
        description: "Like removed successfully",
      });
    } catch (error: any) {
      console.error("Error unliking meme:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to unlike meme",
        variant: "destructive",
      });
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