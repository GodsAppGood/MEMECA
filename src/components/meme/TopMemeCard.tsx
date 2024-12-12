import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TopMemeCardProps {
  meme: {
    id: string;
    title: string;
    image_url: string;
    likes: number;
    created_by?: string;
    isPlaceholder?: boolean;
  };
  position: number;
  userLikes: string[];
  userPoints: number;
  userId: string | null;
  isFirst: boolean;
}

export const TopMemeCard = ({ 
  meme, 
  position, 
  userLikes, 
  userPoints, 
  userId,
  isFirst 
}: TopMemeCardProps) => {
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

  const handleCardClick = () => {
    if (!meme.isPlaceholder && !isFirst) {
      navigate(`/meme/${meme.id}`);
    }
  };

  return (
    <Card 
      className={`overflow-hidden transition-transform duration-300 hover:scale-105 ${
        isFirst ? 'border-2 border-yellow-400' : ''
      } ${meme.isPlaceholder ? 'opacity-50' : ''}`}
    >
      <div 
        className={`cursor-pointer ${!isFirst && !meme.isPlaceholder ? 'hover:cursor-pointer' : ''}`}
        onClick={handleCardClick}
      >
        <div className="relative">
          <img
            src={meme.image_url}
            alt={meme.title}
            className="w-full h-48 object-cover"
          />
          {isFirst && (
            <div className="absolute top-2 right-2">
              <Trophy className="h-6 w-6 text-yellow-400" />
            </div>
          )}
          <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded">
            #{position}
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">{meme.title}</h3>
            {!meme.isPlaceholder && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isFirst) {
                    likeMutation.mutate();
                  }
                }}
                className="hover:text-red-500"
                disabled={isFirst || (userPoints <= 0 && !userLikes.includes(meme.id))}
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
        </div>
      </div>
    </Card>
  );
};