import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLikeActions = (memeId: string, userId: string | null) => {
  const queryClient = useQueryClient();

  const handleLike = async () => {
    if (!userId) {
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
        throw insertError;
      }

      console.log('Successfully liked meme:', memeId);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["memes"] }),
        queryClient.invalidateQueries({ queryKey: ["user-likes"] })
      ]);

    } catch (error: any) {
      console.error("Error in handleLike:", error);
      throw error;
    }
  };

  const handleUnlike = async () => {
    if (!userId) {
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

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["memes"] }),
        queryClient.invalidateQueries({ queryKey: ["user-likes"] })
      ]);

    } catch (error: any) {
      console.error("Error in handleUnlike:", error);
      throw error;
    }
  };

  return {
    handleLike,
    handleUnlike
  };
};