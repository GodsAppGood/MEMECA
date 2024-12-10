import React from "react";
import { Card } from "./ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

interface Meme {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  dateAdded: string;
  blockchain: string;
  tradeLink?: string;
  twitterLink?: string;
  telegramLink?: string;
  likes: number;
  userId: string;
}

interface MemeGridProps {
  selectedDate?: Date;
  selectedBlockchain?: string;
  showTodayOnly?: boolean;
  showTopOnly?: boolean;
}

export const MemeGrid: React.FC<MemeGridProps> = ({ 
  selectedDate, 
  selectedBlockchain, 
  showTodayOnly,
  showTopOnly 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userId = "current-user-id"; // This should be replaced with actual user ID

  const { data: userPoints = 0 } = useQuery({
    queryKey: ["user-points", userId],
    queryFn: () => {
      return parseInt(localStorage.getItem(`points-${userId}`) || "100");
    }
  });

  const { data: userLikes = [] } = useQuery({
    queryKey: ["user-likes", userId],
    queryFn: () => {
      return JSON.parse(localStorage.getItem(`likes-${userId}`) || "[]");
    }
  });

  const { data: memes = [], isLoading } = useQuery({
    queryKey: ["memes", selectedDate, selectedBlockchain, showTodayOnly, showTopOnly],
    queryFn: () => {
      let storedMemes = JSON.parse(localStorage.getItem("memes") || "[]");
      
      if (showTodayOnly) {
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        storedMemes = storedMemes.filter((meme: Meme) => 
          new Date(meme.dateAdded) > last24Hours
        );
      }

      if (selectedDate) {
        storedMemes = storedMemes.filter((meme: Meme) => 
          new Date(meme.dateAdded).toDateString() === selectedDate.toDateString()
        );
      }

      if (selectedBlockchain) {
        storedMemes = storedMemes.filter((meme: Meme) => 
          meme.blockchain.toLowerCase() === selectedBlockchain.toLowerCase()
        );
      }

      storedMemes = storedMemes.sort((a: Meme, b: Meme) => b.likes - a.likes);

      if (showTopOnly) {
        storedMemes = storedMemes.slice(0, 200);
      }

      return storedMemes;
    }
  });

  const likeMutation = useMutation({
    mutationFn: async (memeId: string) => {
      const hasLiked = userLikes.includes(memeId);
      const currentPoints = parseInt(localStorage.getItem(`points-${userId}`) || "100");
      
      if (!hasLiked && currentPoints <= 0) {
        throw new Error("No points available");
      }

      // Update user likes
      const updatedLikes = hasLiked 
        ? userLikes.filter((id: string) => id !== memeId)
        : [...userLikes, memeId];
      localStorage.setItem(`likes-${userId}`, JSON.stringify(updatedLikes));

      // Update memes
      const storedMemes = JSON.parse(localStorage.getItem("memes") || "[]");
      const updatedMemes = storedMemes.map((meme: Meme) => {
        if (meme.id === memeId) {
          return { 
            ...meme, 
            likes: hasLiked ? Math.max(0, (meme.likes || 0) - 1) : (meme.likes || 0) + 1 
          };
        }
        return meme;
      });
      localStorage.setItem("memes", JSON.stringify(updatedMemes));

      // Update points
      const newPoints = hasLiked ? currentPoints + 1 : currentPoints - 1;
      localStorage.setItem(`points-${userId}`, String(newPoints));

      // Update watchlist
      const watchlist = JSON.parse(localStorage.getItem(`watchlist-${userId}`) || "[]");
      const updatedWatchlist = hasLiked
        ? watchlist.filter((id: string) => id !== memeId)
        : [...watchlist, memeId];
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memes.map((meme: Meme) => (
          <Card key={meme.id} className="overflow-hidden">
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
                      likeMutation.mutate(meme.id);
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
        ))}
      </div>
    </div>
  );
};