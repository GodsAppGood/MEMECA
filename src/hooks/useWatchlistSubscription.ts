import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useWatchlistSubscription = (onUpdate: () => void) => {
  useEffect(() => {
    const channel = supabase
      .channel('watchlist_realtime_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Watchlist' },
        () => {
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [onUpdate]);
};