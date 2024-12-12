import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export const useRealtimeSubscription = (
  tables: { name: string; event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*' }[],
  onUpdate: () => void
) => {
  useEffect(() => {
    const channels: RealtimeChannel[] = tables.map(({ name, event = '*' }) =>
      supabase
        .channel(`${name}_changes`)
        .on(
          'postgres_changes',
          { event, schema: 'public', table: name },
          () => {
            console.log(`${name} table changed, updating...`);
            onUpdate();
          }
        )
        .subscribe()
    );

    return () => {
      channels.forEach(channel => {
        void supabase.removeChannel(channel);
      });
    };
  }, [tables, onUpdate]);
};