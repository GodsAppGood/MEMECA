import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useWatchlistStore } from "@/stores/watchlistStore";

interface WatchlistButtonProps {
  memeId: string;
  userId: string | null;
  onAuthRequired: () => void;
}

export const WatchlistButton = ({ memeId, userId, onAuthRequired }: WatchlistButtonProps) => {
  const { isInWatchlist, toggleWatchlist } = useWatchlistStore();
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  useEffect(() => {
    setIsWatchlisted(isInWatchlist(memeId));
  }, [memeId, isInWatchlist]);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!userId) {
      onAuthRequired();
      return;
    }

    await toggleWatchlist(memeId, userId);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className={`hover:text-yellow-500 ${isWatchlisted ? 'text-yellow-500' : ''}`}
    >
      <Star className={`h-4 w-4 ${isWatchlisted ? 'fill-current' : ''}`} />
    </Button>
  );
};