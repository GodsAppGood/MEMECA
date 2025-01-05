import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Meme } from "@/types/meme";
import { useWatchlistStore } from "@/stores/watchlistStore";

interface WatchlistButtonProps {
  meme: Meme;
  userId: string | null;
}

export const WatchlistButton = ({ meme, userId }: WatchlistButtonProps) => {
  const { toast } = useToast();
  const { isInWatchlist, toggleWatchlist } = useWatchlistStore();
  const isWatchlisted = isInWatchlist(meme.id.toString());

  const handleWatchlistToggle = async () => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add memes to your watchlist",
        variant: "destructive"
      });
      return;
    }

    try {
      await toggleWatchlist(meme.id.toString(), userId);
      toast({
        title: isWatchlisted ? "Removed from Watchlist" : "Added to Watchlist",
        description: isWatchlisted 
          ? "The meme has been removed from your watchlist" 
          : "The meme has been added to your watchlist",
      });
    } catch (error) {
      console.error("Error toggling watchlist:", error);
      toast({
        title: "Error",
        description: "Failed to update watchlist status",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleWatchlistToggle}
      className={`group ${isWatchlisted ? 'bg-yellow-50' : ''}`}
    >
      <Star className={`h-5 w-5 mr-2 ${isWatchlisted ? 'fill-yellow-500 text-yellow-500' : ''}`} />
      {isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
    </Button>
  );
};