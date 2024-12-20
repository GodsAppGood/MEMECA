import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useWatchlistSubscription } from "@/hooks/useWatchlistSubscription";

interface WatchlistButtonProps {
  memeId: string;
  userId: string | null;
}

export const WatchlistButton = ({ memeId, userId }: WatchlistButtonProps) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();

  const checkWatchlistStatus = useCallback(async () => {
    if (!userId || isCheckingStatus || !memeId) return;
    
    setIsCheckingStatus(true);
    console.log(`Checking watchlist status for meme ${memeId} and user ${userId}`);
    
    try {
      const numericMemeId = parseInt(memeId);
      if (isNaN(numericMemeId)) {
        console.error("Invalid meme ID:", memeId);
        return;
      }

      const { data, error } = await supabase
        .from("Watchlist")
        .select()
        .eq("user_id", userId)
        .eq("meme_id", numericMemeId)
        .maybeSingle();
      
      if (error) {
        console.error("Error checking watchlist status:", error);
        toast({
          title: "Error",
          description: "Failed to check watchlist status",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Watchlist check result:", data);
      setIsInWatchlist(!!data);
    } catch (error: any) {
      console.error("Unexpected error checking watchlist:", error);
      toast({
        title: "Error",
        description: "Failed to check watchlist status",
        variant: "destructive",
      });
    } finally {
      setIsCheckingStatus(false);
    }
  }, [userId, memeId, toast]);

  useEffect(() => {
    void checkWatchlistStatus();
  }, [checkWatchlistStatus]);

  useWatchlistSubscription(() => {
    console.log("Watchlist subscription triggered, updating status");
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

    if (isLoading) return;

    const numericMemeId = parseInt(memeId);
    if (isNaN(numericMemeId)) {
      console.error("Invalid meme ID:", memeId);
      toast({
        title: "Error",
        description: "Invalid meme ID",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setIsAnimating(true);
    console.log(`Toggling watchlist for meme ${memeId}`);

    try {
      if (!isInWatchlist) {
        const { error: insertError } = await supabase
          .from("Watchlist")
          .insert([{ 
            user_id: userId, 
            meme_id: numericMemeId 
          }]);

        if (insertError) {
          if (insertError.code === '23505') {
            console.log("Meme already in watchlist");
            return;
          }
          throw insertError;
        }

        console.log("Successfully added to watchlist");
        toast({
          title: "Success",
          description: "Added to watchlist",
        });
      } else {
        const { error: deleteError } = await supabase
          .from("Watchlist")
          .delete()
          .eq("user_id", userId)
          .eq("meme_id", numericMemeId);

        if (deleteError) throw deleteError;

        console.log("Successfully removed from watchlist");
        toast({
          title: "Success",
          description: "Removed from watchlist",
        });
      }
    } catch (error: any) {
      console.error("Error toggling watchlist:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update watchlist",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      // Keep animation running for a short while after the action completes
      setTimeout(() => setIsAnimating(false), 300);
    }
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
        ${isInWatchlist ? 'bg-yellow-50' : ''} 
        ${isAnimating ? 'scale-110' : 'scale-100'}
        hover:scale-105
        disabled:opacity-50
        disabled:cursor-not-allowed
      `}
      disabled={isLoading || isCheckingStatus}
    >
      <Star 
        className={`
          h-5 
          w-5 
          transition-all 
          duration-300 
          ${isInWatchlist ? 'fill-current animate-[pulse_0.3s_ease-in-out]' : ''} 
          ${isAnimating ? 'animate-[spin_0.3s_ease-in-out]' : ''}
        `} 
      />
    </Button>
  );
};
