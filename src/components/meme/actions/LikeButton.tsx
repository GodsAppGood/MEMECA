import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface LikeButtonProps {
  meme: {
    id: string;
    likes: number;
  };
  userLikes: string[];
  userPoints: number;
  userId: string | null;
  isFirst?: boolean;
}

export const LikeButton = ({ 
  meme, 
  userLikes, 
  userPoints, 
  userId,
  isFirst 
}: LikeButtonProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!userId) {
        throw new Error("Please login to like memes");
      }

      const hasLiked = userLikes.includes(meme.id);
      setIsProcessing(true);

      try {
        if (hasLiked) {
          // Remove from watchlist
          await supabase
            .from('Watchlist')
            .delete()
            .eq('user_id', userId)
            .eq('meme_id', Number(meme.id));

          // Decrement likes count
          await supabase
            .from('Memes')
            .update({ likes: meme.likes - 1 })
            .eq('id', Number(meme.id));
        } else {
          if (userPoints <= 0) {
            throw new Error("Not enough points");
          }

          // Add to watchlist
          await supabase
            .from('Watchlist')
            .insert([{ 
              user_id: userId, 
              meme_id: Number(meme.id)
            }]);

          // Increment likes count
          await supabase
            .from('Memes')
            .update({ likes: meme.likes + 1 })
            .eq('id', Number(meme.id));
        }
      } finally {
        setIsProcessing(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memes"] });
      queryClient.invalidateQueries({ queryKey: ["user-likes"] });
      queryClient.invalidateQueries({ queryKey: ["user-points"] });
      
      const hasLiked = userLikes.includes(meme.id);
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

  if (isFirst) return null;

  const hasLiked = userLikes.includes(meme.id);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.stopPropagation();
        if (!isProcessing) {
          likeMutation.mutate();
        }
      }}
      className="hover:text-red-500"
      disabled={userPoints <= 0 && !hasLiked}
    >
      <Heart 
        className={`h-4 w-4 ${
          hasLiked ? 'fill-red-500 text-red-500' : ''
        }`} 
      />
      <span className="ml-1">{meme.likes || 0}</span>
    </Button>
  );
};