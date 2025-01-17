import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMemeStatsSubscription = (memeId: number) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`meme_stats_${memeId}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public',
          table: 'Likes',
          filter: `meme_id=eq.${memeId}`
        },
        () => {
          void queryClient.invalidateQueries({ queryKey: ["meme-stats", memeId] });
        }
      )
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public',
          table: 'Watchlist',
          filter: `meme_id=eq.${memeId}`
        },
        () => {
          void queryClient.invalidateQueries({ queryKey: ["meme-stats", memeId] });
        }
      )
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public',
          table: 'TuzemoonPayments',
          filter: `meme_id=eq.${memeId}`
        },
        () => {
          void queryClient.invalidateQueries({ queryKey: ["meme-stats", memeId] });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [memeId, queryClient]);
};