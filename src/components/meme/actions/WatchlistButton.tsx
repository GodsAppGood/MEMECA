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
  
  // Используем useQuery для получения статуса watchlist
  const { data: isInWatchlist = false, refetch } = useQuery({
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

  const handleClick = async () => {
    if (!userId && onAuthRequired) {
      onAuthRequired();
      return;
    }

    try {
      if (isInWatchlist) {
        await supabase
          .from('Watchlist')
          .delete()
          .eq('user_id', userId)
          .eq('meme_id', Number(memeId));

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

        toast({
          title: "Added to Watchlist",
          description: "This meme has been added to your watchlist.",
        });
      }
      
      // Обновляем статус после изменения
      void refetch();
      
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