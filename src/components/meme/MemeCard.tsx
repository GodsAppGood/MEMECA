import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface MemeCardProps {
  meme: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    dateAdded: string;
    likes: number;
  };
  userLikes: string[];
  userPoints: number;
  userId: string;
}

export const MemeCard = ({ meme, userLikes, userPoints, userId }: MemeCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: async () => {
      const hasLiked = userLikes.includes(meme.id);
      const currentPoints = parseInt(localStorage.getItem(`points-${userId}`) || "100");
      
      if (!hasLiked && currentPoints <= 0) {
        throw new Error("No points available");
      }

      // Update user likes
      const updatedLikes = hasLiked 
        ? userLikes.filter(id => id !== meme.id)
        : [...userLikes, meme.id];
      localStorage.setItem(`likes-${userId}`, JSON.stringify(updatedLikes));

      // Update memes
      const storedMemes = JSON.parse(localStorage.getItem("memes") || "[]");
      const updatedMemes = storedMemes.map((m: typeof meme) => {
        if (m.id === meme.id) {
          return { 
            ...m, 
            likes: hasLiked ? Math.max(0, (m.likes || 0) - 1) : (m.likes || 0) + 1 
          };
        }
        return m;
      });
      localStorage.setItem("memes", JSON.stringify(updatedMemes));

      // Update points
      const newPoints = hasLiked ? currentPoints + 1 : currentPoints - 1;
      localStorage.setItem(`points-${userId}`, String(newPoints));

      // Update watchlist
      const watchlist = JSON.parse(localStorage.getItem(`watchlist-${userId}`) || "[]");
      const updatedWatchlist = hasLiked
        ? watchlist.filter((id: string) => id !== meme.id)
        : [...watchlist, meme.id];
      localStorage.setItem(`watchlist-${userId}`, JSON.stringify(updatedWatchlist));

      return { hasLiked, newPoints };
    },
    onSuccess: ({ hasLiked, newPoints }) => {
      queryClient.invalidateQueries({ queryKey: ["memes"] });
      queryClient.invalidateQueries({ queryKey: ["user-points"] });
      queryClient.invalidateQueries({ queryKey: ["user-likes"] });
      queryClient.invalidateQueries({ queryKey: ["watchlist-memes"] });

      if (hasLiked) {
        toast({
          title: "Meme unliked",
          description: "Meme removed from watchlist and 1 point returned",
        });
      } else {
        if (newPoints <= 10) {
          toast({
            title: "Low points warning",
            description: "You have 10 or fewer points remaining. Invite friends to earn more!",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Meme liked",
            description: "Meme added to watchlist",
          });
        }
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to like meme",
      });
    }
  });

  return (
    <Card className="overflow-hidden">
      <div 
        className="cursor-pointer" 
        onClick={() => navigate(`/meme/${meme.id}`)}
      >
        <img
          src={meme.imageUrl}
          alt={meme.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{meme.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {meme.description}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Posted on {new Date(meme.dateAdded).toLocaleDateString()}
            </span>
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
      </div>
    </Card>
  );
};