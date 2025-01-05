import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RealtimePostgresChangesFilter } from "@supabase/supabase-js";

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
      const filterObj: RealtimePostgresChangesFilter<any> = {
        event,
        schema: 'public',
        table: name,
      };

      if (filter) {
        filterObj.filter = filter;
      }

      channel.on(
        'postgres_changes',
        filterObj,
        (payload) => {
          console.log(`Realtime update received for ${name}:`, payload);
          onUpdate();
        }
      );
    });

    channel.subscribe((status) => {
      console.log(`Realtime subscription status for channel:`, status);
    });

    return () => {
      console.log('Cleaning up realtime subscription');
      void supabase.removeChannel(channel);
    };
  }, [tables, onUpdate]);
};