import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useLikeActions = (memeId: string, userId: string | null) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleLike = async () => {
    if (!userId) {
      console.error("No user ID provided for like action");
      throw new Error("Please login to like memes");
    }

    console.log('Attempting to like meme:', { memeId, userId });

    try {
      const { error: insertError } = await supabase
        .from('Likes')
        .insert([{ 
          user_id: userId, 
          meme_id: Number(memeId)
        }]);

      if (insertError) {
        console.error('Error inserting like:', insertError);
        if (insertError.code === '23505') {
          throw new Error("You've already liked this meme");
        }
        throw insertError;
      }

      console.log('Successfully liked meme:', memeId);

      // Invalidate all relevant queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["memes"] }),
        queryClient.invalidateQueries({ queryKey: ["user-likes"] }),
        queryClient.invalidateQueries({ queryKey: ["top-memes"] }),
        queryClient.invalidateQueries({ queryKey: ["watchlist-memes"] }),
        queryClient.invalidateQueries({ queryKey: ["featured-memes"] })
      ]);

      toast({
        title: "Success",
        description: "Meme liked successfully",
      });

    } catch (error: any) {
      console.error("Error in handleLike:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to like meme",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleUnlike = async () => {
    if (!userId) {
      console.error("No user ID provided for unlike action");
      throw new Error("Please login to unlike memes");
    }

    console.log('Attempting to unlike meme:', { memeId, userId });

    try {
      const { error: deleteError } = await supabase
        .from('Likes')
        .delete()
        .eq('user_id', userId)
        .eq('meme_id', Number(memeId));

      if (deleteError) {
        console.error('Error deleting like:', deleteError);
        throw deleteError;
      }

      console.log('Successfully unliked meme:', memeId);

      // Invalidate all relevant queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["memes"] }),
        queryClient.invalidateQueries({ queryKey: ["user-likes"] }),
        queryClient.invalidateQueries({ queryKey: ["top-memes"] }),
        queryClient.invalidateQueries({ queryKey: ["watchlist-memes"] }),
        queryClient.invalidateQueries({ queryKey: ["featured-memes"] })
      ]);

      toast({
        title: "Success",
        description: "Meme unliked successfully",
      });

    } catch (error: any) {
      console.error("Error in handleUnlike:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to unlike meme",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    handleLike,
    handleUnlike
  };
};