import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useWatchlistStore } from "@/stores/watchlistStore";

interface WatchlistButtonProps {
  memeId: string;
  userId?: string | null;
  onAuthRequired?: () => void;
  showText?: boolean;
  className?: string;
}

export const WatchlistButton = ({ 
  memeId, 
  userId, 
  onAuthRequired,
  showText = false,
  className = ""
}: WatchlistButtonProps) => {
  const { toast } = useToast();
  const { watchlist, toggleWatchlist, isInWatchlist, initializeWatchlist } = useWatchlistStore();

  // Initialize watchlist when component mounts and userId is available
  useEffect(() => {
    if (userId) {
      void initializeWatchlist(userId);
    }
  }, [userId, initializeWatchlist]);

  // Subscribe to realtime changes
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('watchlist_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Watchlist',
          filter: `user_id=eq.${userId}`
        },
        () => {
          console.log('Watchlist changed, reinitializing...');
          void initializeWatchlist(userId);
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId, initializeWatchlist]);

  const handleClick = async () => {
    if (!userId && onAuthRequired) {
      onAuthRequired();
      return;
    }

    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to use watchlist",
        variant: "destructive",
      });
      return;
    }

    try {
      await toggleWatchlist(memeId, userId);
      toast({
        title: isInWatchlist(memeId) ? "Removed from Watchlist" : "Added to Watchlist",
        description: isInWatchlist(memeId) 
          ? "This meme has been removed from your watchlist"
          : "This meme has been added to your watchlist",
      });
    } catch (error) {
      console.error("Error updating watchlist:", error);
      toast({
        title: "Error",
        description: "Failed to update watchlist",
        variant: "destructive",
      });
    }
  };

  const isWatched = isInWatchlist(memeId);

  return (
    <Button
      variant={isWatched ? "secondary" : "ghost"}
      size={showText ? "default" : "icon"}
      onClick={handleClick}
      className={`${className} ${isWatched ? 'bg-primary/10' : ''}`}
    >
      <Bookmark className={`h-4 w-4 ${isWatched ? 'fill-primary' : ''}`} />
      {showText && (
        <span className="ml-2">
          {isWatched ? "Remove from Watchlist" : "Add to Watchlist"}
        </span>
      )}
    </Button>
  );
};