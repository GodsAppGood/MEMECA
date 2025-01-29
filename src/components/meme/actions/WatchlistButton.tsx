import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkWatchlistStatus = async () => {
      if (!userId) return;

      const { data } = await supabase
        .from('Watchlist')
        .select('id')
        .eq('user_id', userId)
        .eq('meme_id', Number(memeId))
        .maybeSingle();

      setIsInWatchlist(!!data);
    };

    void checkWatchlistStatus();
  }, [userId, memeId]);

  const handleClick = async () => {
    if (!userId && onAuthRequired) {
      onAuthRequired();
      return;
    }

    setIsLoading(true);
    try {
      if (isInWatchlist) {
        await supabase
          .from('Watchlist')
          .delete()
          .eq('user_id', userId)
          .eq('meme_id', Number(memeId));

        setIsInWatchlist(false);
        toast({
          title: "Removed from Watchlist",
          description: "This meme has been removed from your watchlist.",
        });
      } else {
        await supabase
          .from('Watchlist')
          .insert([{ 
            user_id: userId, 
            meme_id: Number(memeId) 
          }]);

        setIsInWatchlist(true);
        toast({
          title: "Added to Watchlist",
          description: "This meme has been added to your watchlist.",
        });
      }
    } catch (error) {
      console.error("Error updating watchlist:", error);
      toast({
        title: "Error",
        description: "Failed to update watchlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size={showText ? "default" : "icon"}
      onClick={handleClick}
      className={className}
      disabled={isLoading}
    >
      <Bookmark 
        className={`h-4 w-4 ${isInWatchlist ? 'fill-primary text-primary' : ''}`} 
      />
      {showText && (
        <span className="ml-2">
          {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        </span>
      )}
    </Button>
  );
};