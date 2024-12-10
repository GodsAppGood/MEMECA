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
}

export const MemeGrid: React.FC<MemeGridProps> = ({ selectedDate, selectedBlockchain, showTodayOnly }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: memes = [], isLoading } = useQuery({
    queryKey: ["memes", selectedDate, selectedBlockchain, showTodayOnly],
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

      return storedMemes.sort((a: Meme, b: Meme) => b.likes - a.likes);
    }
  });

  const likeMutation = useMutation({
    mutationFn: async (memeId: string) => {
      const storedMemes = JSON.parse(localStorage.getItem("memes") || "[]");
      const updatedMemes = storedMemes.map((meme: Meme) => {
        if (meme.id === memeId) {
          return { ...meme, likes: (meme.likes || 0) + 1 };
        }
        return meme;
      });
      localStorage.setItem("memes", JSON.stringify(updatedMemes));

      // Add to watchlist
      const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
      if (!watchlist.includes(memeId)) {
        watchlist.push(memeId);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
      }

      // Add to author's watchlist
      const authorWatchlist = JSON.parse(localStorage.getItem(`watchlist-${meme.userId}`) || "[]");
      if (!authorWatchlist.includes(memeId)) {
        authorWatchlist.push(memeId);
        localStorage.setItem(`watchlist-${meme.userId}`, JSON.stringify(authorWatchlist));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memes"] });
      toast({
        title: "Success",
        description: "Meme added to watchlist",
      });
    },
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
                  >
                    <Heart className={`h-4 w-4 ${meme.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
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