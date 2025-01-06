import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const useRealtimeLikes = (memeId: string | number) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('likes_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public',
          table: 'Likes',
          filter: `meme_id=eq.${memeId}`
        },
        () => {
          console.log("Likes changed, refetching...");
          // Invalidate related queries to trigger refetch
          void queryClient.invalidateQueries({ queryKey: ['memes'] });
          void queryClient.invalidateQueries({ queryKey: ['user-likes'] });
          void queryClient.invalidateQueries({ queryKey: ['featured-memes'] });
          void queryClient.invalidateQueries({ queryKey: ['watchlist-memes'] });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [memeId, queryClient]);
};