import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useWatchlistSubscription } from "@/hooks/useWatchlistSubscription";

interface WatchlistButtonProps {
  memeId: string;
  userId: string | null;
}

export const WatchlistButton = ({ memeId, userId }: WatchlistButtonProps) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const { toast } = useToast();

  const checkWatchlistStatus = async () => {
    if (!userId) return;
    
    const { data } = await supabase
      .from("Watchlist")
      .select()
      .eq("user_id", userId)
      .eq("meme_id", parseInt(memeId))
      .single();
    
    setIsInWatchlist(!!data);
  };

  useEffect(() => {
    void checkWatchlistStatus();
  }, [userId, memeId]);

  useWatchlistSubscription(() => {
    void checkWatchlistStatus();
  });

  const handleWatchlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to add to watchlist",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!isInWatchlist) {
        await supabase
          .from("Watchlist")
          .insert([{ 
            user_id: userId, 
            meme_id: parseInt(memeId) 
          }]);
        toast({
          title: "Success",
          description: "Added to watchlist",
        });
      } else {
        await supabase
          .from("Watchlist")
          .delete()
          .eq("user_id", userId)
          .eq("meme_id", parseInt(memeId));
        toast({
          title: "Success",
          description: "Removed from watchlist",
        });
      }
    } catch (error) {
      console.error("Error toggling watchlist:", error);
      toast({
        title: "Error",
        description: "Failed to update watchlist",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleWatchlist}
      className={`text-yellow-500 ${isInWatchlist ? 'bg-yellow-50' : ''}`}
    >
      <Star className={`h-5 w-5 ${isInWatchlist ? "fill-current" : ""}`} />
    </Button>
  );
};