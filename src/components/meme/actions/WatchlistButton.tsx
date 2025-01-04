import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useWatchlistStore, subscribeToWatchlistChanges } from "@/stores/watchlistStore";
import { useToast } from "@/hooks/use-toast";

interface WatchlistButtonProps {
  memeId: string;
  userId: string | null;
}

export const WatchlistButton = ({ memeId, userId }: WatchlistButtonProps) => {
  const { isInWatchlist, toggleWatchlist, isLoading } = useWatchlistStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;
    
    // Initialize watchlist for this user
    void useWatchlistStore.getState().initializeWatchlist(userId);
    
    // Set up realtime subscription for cross-page synchronization
    const cleanup = subscribeToWatchlistChanges(userId);
    return () => {
      cleanup();
    };
  }, [userId]);

  const handleWatchlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add memes to your watchlist",
        variant: "destructive"
      });
      return;
    }
    
    if (isLoading) return;

    try {
      setIsAnimating(true);
      await toggleWatchlist(memeId, userId);
      
      const isCurrentlyInWatchlist = isInWatchlist(memeId);
      toast({
        title: isCurrentlyInWatchlist ? "Added to Watchlist" : "Removed from Watchlist",
        description: isCurrentlyInWatchlist 
          ? "The meme has been added to your watchlist" 
          : "The meme has been removed from your watchlist",
        variant: "default"
      });
    } catch (error) {
      console.error("Error toggling watchlist:", error);
      toast({
        title: "Error",
        description: "Failed to update watchlist. Please try again.",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const isWatchlisted = isInWatchlist(memeId);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleWatchlist}
      className={`
        group
        relative
        transition-all 
        duration-300 
        ${isWatchlisted ? 'text-yellow-500 bg-yellow-50' : 'text-yellow-500'} 
        ${isAnimating ? 'scale-110' : 'scale-100'}
        hover:scale-105
        disabled:opacity-50
        disabled:cursor-not-allowed
      `}
      disabled={isLoading}
      title={isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
    >
      <Star 
        className={`
          h-5 
          w-5 
          transition-all 
          duration-300 
          ${isWatchlisted ? 'fill-current animate-[pulse_0.3s_ease-in-out]' : ''} 
          ${isAnimating ? 'animate-[spin_0.3s_ease-in-out]' : ''}
        `} 
      />
      {!userId && (
        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          Login to add to watchlist
        </span>
      )}
    </Button>
  );
};