import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel, RealtimePostgresChangesFilter } from "@supabase/supabase-js";

interface TableSubscription {
  name: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  filter?: string;
}

export const useRealtimeSubscription = (
  tables: TableSubscription[],
  onUpdate: () => void
) => {
  useEffect(() => {
    const channel = supabase.channel('db-changes');

    tables.forEach(({ name, event = "*", filter }) => {
      channel.on(
        'postgres_changes' as const,
        {
          event,
          schema: 'public',
          table: name,
          filter,
        } satisfies RealtimePostgresChangesFilter<any>,
        () => {
          onUpdate();
        }
      );
    });

    channel.subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [tables, onUpdate]);
};