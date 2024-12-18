import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useLikesSubscription = (onUpdate: () => void) => {
  useEffect(() => {
    const channel = supabase
      .channel('likes_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'Likes' 
        },
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