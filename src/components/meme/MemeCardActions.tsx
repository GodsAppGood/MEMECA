import { Button } from "@/components/ui/button";
import { Heart, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MemeCardActionsProps {
  meme: {
    id: string;
    likes: number;
    created_by?: string;
  };
  userLikes: string[];
  userPoints: number;
  userId: string | null;
  isFirst?: boolean;
}

export const MemeCardActions = ({ 
  meme, 
  userLikes, 
  userPoints, 
  userId,
  isFirst 
}: MemeCardActionsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!userId) {
        throw new Error("Please login to like memes");
      }

      const hasLiked = userLikes.includes(meme.id);

      if (!hasLiked && userPoints <= 0) {
        throw new Error("Not enough points");
      }

      if (hasLiked) {
        await supabase
          .from('Watchlist')
          .delete()
          .eq('user_id', userId)
          .eq('meme_id', Number(meme.id));

        await supabase
          .from('Memes')
          .update({ likes: meme.likes - 1 })
          .eq('id', Number(meme.id));
      } else {
        await supabase
          .from('Watchlist')
          .insert([{ 
            user_id: userId, 
            meme_id: Number(meme.id)
          }]);

        await supabase
          .from('Memes')
          .update({ likes: meme.likes + 1 })
          .eq('id', Number(meme.id));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["top-memes"] });
      queryClient.invalidateQueries({ queryKey: ["user-likes"] });
      queryClient.invalidateQueries({ queryKey: ["user-points"] });
      toast({
        title: "Success",
        description: userLikes.includes(meme.id) 
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

  const handleEdit = () => {
    if (userId !== meme.created_by) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You can only edit your own memes",
      });
      return;
    }
    localStorage.setItem("editingMeme", JSON.stringify(meme));
    navigate("/submit");
  };

  return (
    <div className="flex gap-2">
      {userId === meme.created_by && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            handleEdit();
          }}
          className="hover:text-blue-500"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      {!isFirst && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            likeMutation.mutate();
          }}
          className="hover:text-red-500"
          disabled={userPoints <= 0 && !userLikes.includes(meme.id)}
        >
          <Heart 
            className={`h-4 w-4 ${
              userLikes.includes(meme.id) ? 'fill-red-500 text-red-500' : ''
            }`} 
          />
          <span className="ml-1">{meme.likes || 0}</span>
        </Button>
      )}
    </div>
  );
};