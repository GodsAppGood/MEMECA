import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useWatchlistStore, subscribeToWatchlistChanges } from "@/stores/watchlistStore";

interface WatchlistButtonProps {
  memeId: string;
  userId: string | null;
}

export const WatchlistButton = ({ memeId, userId }: WatchlistButtonProps) => {
  const { isInWatchlist, toggleWatchlist, isLoading } = useWatchlistStore();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!userId) return;
    
    // Initialize watchlist for this user
    void useWatchlistStore.getState().initializeWatchlist(userId);
    
    // Set up realtime subscription
    const cleanup = subscribeToWatchlistChanges(userId);
    return () => {
      cleanup();
    };
  }, [userId]);

  const handleWatchlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId || isLoading) return;

    setIsAnimating(true);
    await toggleWatchlist(memeId, userId);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleWatchlist}
      className={`
        text-yellow-500 
        transition-all 
        duration-300 
        ${isInWatchlist(memeId) ? 'bg-yellow-50' : ''} 
        ${isAnimating ? 'scale-110' : 'scale-100'}
        hover:scale-105
        disabled:opacity-50
        disabled:cursor-not-allowed
      `}
      disabled={isLoading}
    >
      <Star 
        className={`
          h-5 
          w-5 
          transition-all 
          duration-300 
          ${isInWatchlist(memeId) ? 'fill-current animate-[pulse_0.3s_ease-in-out]' : ''} 
          ${isAnimating ? 'animate-[spin_0.3s_ease-in-out]' : ''}
        `} 
      />
    </Button>
  );
};