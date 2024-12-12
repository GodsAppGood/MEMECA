import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface TableSubscription {
  name: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
}

type PostgresChangesPayload = {
  commit_timestamp: string;
  errors: null | any[];
  schema: string;
  table: string;
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  old_record: any;
  record: any;
};

export const useRealtimeSubscription = (
  tables: TableSubscription[],
  onUpdate: (payload?: PostgresChangesPayload) => void
) => {
  useEffect(() => {
    const channels: RealtimeChannel[] = tables.map(({ name, event = '*' }) => {
      const channel = supabase.channel(`${name}_changes`);
      
      channel.on(
        'postgres_changes',
        {
          event,
          schema: 'public',
          table: name
        },
        (payload: PostgresChangesPayload) => {
          console.log(`${name} table changed:`, payload);
          onUpdate(payload);
        }
      ).subscribe();

      return channel;
    });

    return () => {
      channels.forEach(channel => {
        void supabase.removeChannel(channel);
      });
    };
  }, [tables, onUpdate]);
};