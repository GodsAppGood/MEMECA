import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
          console.log("Likes changed, invalidating queries...");
          void queryClient.invalidateQueries({ queryKey: ["memes"] });
          void queryClient.invalidateQueries({ queryKey: ["top-memes"] });
          void queryClient.invalidateQueries({ queryKey: ["watchlist-memes"] });
          void queryClient.invalidateQueries({ queryKey: ["featured-memes"] });
          void queryClient.invalidateQueries({ queryKey: ["user-likes"] });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [memeId, queryClient]);
};