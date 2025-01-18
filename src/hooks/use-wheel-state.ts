import { useState, useEffect } from 'react';
import { WheelState } from '@/types/wheel';
import { supabase } from "@/integrations/supabase/client";

const POLLING_INTERVAL = 5000; // 5 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export const useWheelState = () => {
  const [wheelState, setWheelState] = useState<WheelState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWheelState = async (retryCount = 0) => {
      try {
        console.log('Fetching wheel state, attempt:', retryCount + 1);
        
        const { data, error: functionError } = await supabase.functions.invoke('wheel-state', {
          body: { timestamp: new Date().toISOString() }
        });

        if (functionError) {
          throw new Error(`Function error: ${functionError.message}`);
        }

        if (!data && retryCount < MAX_RETRIES) {
          console.log('No data received, retrying...');
          setTimeout(() => fetchWheelState(retryCount + 1), RETRY_DELAY);
          return;
        }

        if (!data) {
          throw new Error('No data received after retries');
        }

        console.log('Wheel state fetched successfully:', data);
        setWheelState(data);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Error fetching wheel state:', err);
        
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying in ${RETRY_DELAY}ms...`);
          setTimeout(() => fetchWheelState(retryCount + 1), RETRY_DELAY);
          return;
        }
        
        setError(errorMessage);
      } finally {
        if (retryCount === MAX_RETRIES || retryCount === 0) {
          setIsLoading(false);
        }
      }
    };

    // Initial fetch
    fetchWheelState();

    // Set up polling
    const intervalId = setInterval(() => fetchWheelState(), POLLING_INTERVAL);

    // Cleanup
    return () => clearInterval(intervalId);
  }, []);

  return { wheelState, isLoading, error };
};