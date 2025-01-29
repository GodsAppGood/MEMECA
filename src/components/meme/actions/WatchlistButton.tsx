import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

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
  const [localWatchlistState, setLocalWatchlistState] = useState(false);
  
  const { data: isInWatchlist = false } = useQuery({
    queryKey: ["watchlist-status", userId, memeId],
    queryFn: async () => {
      if (!userId) return false;
      
      const { data } = await supabase
        .from('Watchlist')
        .select('id')
        .eq('user_id', userId)
        .eq('meme_id', Number(memeId))
        .maybeSingle();
        
      return !!data;
    },
    enabled: !!userId && !!memeId
  });

  useEffect(() => {
    setLocalWatchlistState(isInWatchlist);
  }, [isInWatchlist]);

  const handleClick = async () => {
    if (!userId && onAuthRequired) {
      onAuthRequired();
      return;
    }

    try {
      if (localWatchlistState) {
        const { error } = await supabase
          .from('Watchlist')
          .delete()
          .eq('user_id', userId)
          .eq('meme_id', Number(memeId));

        if (error) {
          console.error("Full error details:", error);
          throw error;
        }
        
        setLocalWatchlistState(false);
        toast({
          title: "Removed from Watchlist",
          description: "This meme has been removed from your watchlist.",
        });
      } else {
        const { error } = await supabase
          .from('Watchlist')
          .insert([{ 
            user_id: userId, 
            meme_id: Number(memeId) 
          }]);

        if (error) {
          console.error("Full error details:", error);
          throw error;
        }
        
        setLocalWatchlistState(true);
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
    }
  };

  return (
    <Button
      variant="ghost"
      size={showText ? "default" : "icon"}
      onClick={handleClick}
      className={className}
    >
      <Bookmark 
        className={`h-4 w-4 ${localWatchlistState ? 'fill-primary text-primary' : ''}`} 
      />
      {showText && (
        <span className="ml-2">
          {localWatchlistState ? "Remove from Watchlist" : "Add to Watchlist"}
        </span>
      )}
    </Button>
  );
};