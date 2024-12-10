import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Meme {
  id: string;
  title: string;
  imageUrl: string;
  likes: number;
  dateAdded: string;
  description: string;
}

export function Watchlist() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userId = "current-user-id"; // This should be replaced with actual user ID

  const { data: likedMemes = [] } = useQuery({
    queryKey: ["watchlist-memes", userId],
    queryFn: () => {
      const watchlist = JSON.parse(localStorage.getItem(`watchlist-${userId}`) || "[]");
      const allMemes = JSON.parse(localStorage.getItem("memes") || "[]");
      return allMemes.filter((meme: Meme) => watchlist.includes(meme.id));
    }
  });

  const unlikeMutation = useMutation({
    mutationFn: async (memeId: string) => {
      // Remove from watchlist
      const watchlist = JSON.parse(localStorage.getItem(`watchlist-${userId}`) || "[]");
      const updatedWatchlist = watchlist.filter((id: string) => id !== memeId);
      localStorage.setItem(`watchlist-${userId}`, JSON.stringify(updatedWatchlist));

      // Update meme likes
      const storedMemes = JSON.parse(localStorage.getItem("memes") || "[]");
      const updatedMemes = storedMemes.map((meme: Meme) => {
        if (meme.id === memeId) {
          return { ...meme, likes: Math.max(0, (meme.likes || 0) - 1) };
        }
        return meme;
      });
      localStorage.setItem("memes", JSON.stringify(updatedMemes));

      // Return point to user
      const currentPoints = parseInt(localStorage.getItem(`points-${userId}`) || "100");
      localStorage.setItem(`points-${userId}`, String(currentPoints + 1));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist-memes"] });
      queryClient.invalidateQueries({ queryKey: ["memes"] });
      queryClient.invalidateQueries({ queryKey: ["user-points"] });
      toast({
        title: "Success",
        description: "Meme removed from watchlist",
      });
    },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-serif font-bold">My Watchlist</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {likedMemes.map((meme: Meme) => (
          <Card key={meme.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="font-serif">{meme.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => unlikeMutation.mutate(meme.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Heart className="h-4 w-4 fill-current" />
                  <span className="ml-1">{meme.likes}</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div 
                className="cursor-pointer" 
                onClick={() => navigate(`/meme/${meme.id}`)}
              >
                <img 
                  src={meme.imageUrl} 
                  alt={meme.title} 
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <p className="text-sm text-gray-600">{meme.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}