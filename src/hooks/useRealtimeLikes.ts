import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useRealtimeLikes = (memeId: string | number) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log("Setting up realtime subscription for meme:", memeId);

    const channel = supabase
      .channel(`likes_changes_${memeId}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public',
          table: 'Likes',
          filter: `meme_id=eq.${memeId}`
        },
        (payload) => {
          console.log("Likes changed, invalidating queries...", payload);
          void queryClient.invalidateQueries({ queryKey: ["memes"] });
          void queryClient.invalidateQueries({ queryKey: ["top-memes"] });
          void queryClient.invalidateQueries({ queryKey: ["watchlist-memes"] });
          void queryClient.invalidateQueries({ queryKey: ["featured-memes"] });
          void queryClient.invalidateQueries({ queryKey: ["user-likes"] });
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });

    return () => {
      console.log("Cleaning up realtime subscription for meme:", memeId);
      void supabase.removeChannel(channel);
    };
  }, [memeId, queryClient]);
};