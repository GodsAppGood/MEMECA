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
  const { isInWatchlist, toggleWatchlist, isLoading, initializeWatchlist } = useWatchlistStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    if (!userId) return;
    
    let cleanup: (() => void) | undefined;

    const initWatchlist = async () => {
      try {
        await initializeWatchlist(userId);
        cleanup = subscribeToWatchlistChanges(userId);
      } catch (error) {
        console.error('Error initializing watchlist:', error);
        setConnectionError(true);
      }
    };

    void initWatchlist();
    
    return () => {
      if (cleanup) cleanup();
    };
  }, [userId, initializeWatchlist]);

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
    
    if (isLoading || connectionError) return;

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
      setConnectionError(true);
      toast({
        title: "Connection Error",
        description: "Failed to update watchlist. Please try again later.",
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
        watchlist-toggle
        group
        relative
        transition-all 
        duration-300 
        ${isWatchlisted ? 'text-yellow-500 bg-yellow-50' : 'text-yellow-500'} 
        ${isAnimating ? 'scale-110' : 'scale-100'}
        hover:scale-105
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${connectionError ? 'opacity-50' : ''}
      `}
      disabled={isLoading || connectionError}
      title={isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
      data-meme-id={memeId}
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
      {connectionError && (
        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-red-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          Connection error. Try refreshing.
        </span>
      )}
    </Button>
  );
};