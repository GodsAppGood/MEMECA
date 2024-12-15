import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TableSubscription {
  name: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
}

export const useRealtimeSubscription = (
  tables: TableSubscription[],
  onUpdate: () => void
) => {
  useEffect(() => {
    const channels = tables.map(({ name, event = '*' }) => {
      return supabase
        .channel(`${name}_changes`)
        .on(
          'postgres_changes' as const,
          {
            event,
            schema: 'public',
            table: name
          },
          () => {
            onUpdate();
          }
        )
        .subscribe();
    });

    return () => {
      channels.forEach(channel => {
        void supabase.removeChannel(channel);
      });
    };
  }, [tables, onUpdate]);
};