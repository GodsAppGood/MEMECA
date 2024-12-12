import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MemeCardProps {
  meme: {
    id: string;
    title: string;
    description: string;
    image_url: string;
    created_at: string;
    likes: number;
    created_by: string;
  };
  userLikes: string[];
  userPoints: number;
  userId: string | null;
}

export const MemeCard = ({ meme, userLikes, userPoints, userId }: MemeCardProps) => {
  const checkIfInWatchlist = async (userId: string, memeId: string) => {
    const { data: watchlistItems } = await supabase
      .from('Watchlist')
      .select('*')
      .eq('user_id', userId)
      .eq('meme_id', Number(memeId))
      .single();
    
    return !!watchlistItems;
  };

  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!userId) {
        throw new Error("Необходимо авторизоваться");
      }

      const hasLiked = userLikes.includes(meme.id);

      if (!hasLiked && userPoints <= 0) {
        throw new Error("Недостаточно очков");
      }

      if (hasLiked) {
        // Remove like
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
        // Add like
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
      queryClient.invalidateQueries({ queryKey: ["memes"] });
      queryClient.invalidateQueries({ queryKey: ["user-likes"] });
      queryClient.invalidateQueries({ queryKey: ["user-points"] });
      toast({
        title: "Успех",
        description: userLikes.includes(meme.id) 
          ? "Мем удален из избранного" 
          : "Мем добавлен в избранное",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось обновить лайк",
      });
    }
  });

  const handleEdit = () => {
    if (userId !== meme.created_by) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Вы можете редактировать только свои мемы",
      });
      return;
    }
    localStorage.setItem("editingMeme", JSON.stringify(meme));
    navigate("/submit");
  };

  return (
    <Card className="overflow-hidden">
      <div 
        className="cursor-pointer" 
        onClick={() => navigate(`/meme/${meme.id}`)}
      >
        <img
          src={meme.image_url}
          alt={meme.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">{meme.title}</h3>
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
                <Heart className={`h-4 w-4 ${userLikes.includes(meme.id) ? 'fill-red-500 text-red-500' : ''}`} />
                <span className="ml-1">{meme.likes || 0}</span>
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {meme.description}
          </p>
          <span className="text-sm text-muted-foreground">
            {new Date(meme.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Card>
  );
};