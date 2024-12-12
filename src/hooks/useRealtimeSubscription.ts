import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface TableSubscription {
  name: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
}

export const useRealtimeSubscription = (
  tables: TableSubscription[],
  onUpdate: (payload?: RealtimePostgresChangesPayload<any>) => void
) => {
  useEffect(() => {
    const channels: RealtimeChannel[] = tables.map(({ name, event = '*' }) => {
      const channel = supabase.channel(`${name}_changes`);
      
      channel
        .on(
          'postgres_changes',
          {
            event,
            schema: 'public',
            table: name
          },
          (payload) => {
            console.log(`${name} table changed:`, payload);
            onUpdate(payload);
          }
        )
        .subscribe();

      return channel;
    });

    return () => {
      channels.forEach(channel => {
        void supabase.removeChannel(channel);
      });
    };
  }, [tables, onUpdate]);
};