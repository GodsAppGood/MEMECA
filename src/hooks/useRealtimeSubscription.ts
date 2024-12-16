import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface TableSubscription {
  name: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
}

export const useRealtimeSubscription = (
  tables: TableSubscription[],
  onUpdate: () => void
) => {
  useEffect(() => {
    const channels: RealtimeChannel[] = tables.map(({ name, event = '*' }) => {
      return supabase
        .channel(`realtime:${name}`)
        .on(
          'postgres_changes' as const,
          {
            event,
            schema: 'public',
            table: name
          },
          (payload: RealtimePostgresChangesPayload<{[key: string]: any}>) => {
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