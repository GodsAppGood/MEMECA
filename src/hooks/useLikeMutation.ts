import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseLikeMutationProps {
  memeId: string;
  currentLikes: number;
  userId: string | null;
  userLikes: string[];
  userPoints: number;
}

export const useLikeMutation = ({ 
  memeId, 
  currentLikes, 
  userId, 
  userLikes,
  userPoints 
}: UseLikeMutationProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const hasLiked = userLikes.includes(memeId);

  return useMutation({
    mutationFn: async () => {
      if (!userId) {
        throw new Error("Please login to like memes");
      }

      if (hasLiked) {
        // Remove from watchlist
        await supabase
          .from('Watchlist')
          .delete()
          .eq('user_id', userId)
          .eq('meme_id', Number(memeId));

        // Decrement likes count
        await supabase
          .from('Memes')
          .update({ likes: currentLikes - 1 })
          .eq('id', Number(memeId));
      } else {
        if (userPoints <= 0) {
          throw new Error("Not enough points");
        }

        // Add to watchlist
        await supabase
          .from('Watchlist')
          .insert([{ 
            user_id: userId, 
            meme_id: Number(memeId)
          }]);

        // Increment likes count
        await supabase
          .from('Memes')
          .update({ likes: currentLikes + 1 })
          .eq('id', Number(memeId));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memes"] });
      queryClient.invalidateQueries({ queryKey: ["user-likes"] });
      queryClient.invalidateQueries({ queryKey: ["user-points"] });
      
      toast({
        title: "Success",
        description: hasLiked 
          ? "Meme removed from watchlist" 
          : "Meme added to watchlist",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update like",
      });
    }
  });
};