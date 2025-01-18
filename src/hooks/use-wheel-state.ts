import { useState, useEffect } from 'react';
import { WheelState } from '@/types/wheel';
import { supabase } from "@/integrations/supabase/client";

const POLLING_INTERVAL = 5000; // 5 seconds

export const useWheelState = () => {
  const [wheelState, setWheelState] = useState<WheelState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWheelState = async () => {
      try {
        const { data, error: invokeError } = await supabase.functions.invoke('wheel-state', {
          method: 'GET'
        });

        if (invokeError) {
          console.error('Wheel state fetch error:', invokeError);
          throw new Error(invokeError.message);
        }

        console.log('Wheel state fetched successfully:', data);
        setWheelState(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching wheel state:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchWheelState();

    // Set up polling
    const intervalId = setInterval(fetchWheelState, POLLING_INTERVAL);

    // Cleanup
    return () => clearInterval(intervalId);
  }, []);

  return { wheelState, isLoading, error };
};