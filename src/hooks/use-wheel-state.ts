import { useState, useEffect } from 'react';
import { WheelState } from '@/types/wheel';
import { supabase } from "@/integrations/supabase/client";

const POLLING_INTERVAL = 5000; // 5 seconds
const WHEEL_FUNCTION_URL = 'https://omdhcgwcplbgfvjtrswe.functions.supabase.co/wheel-state';

export const useWheelState = () => {
  const [wheelState, setWheelState] = useState<WheelState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWheelState = async () => {
      try {
        // Direct fetch to the wheel function URL
        const response = await fetch(WHEEL_FUNCTION_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Wheel state fetched successfully:', data);
        setWheelState(data);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Error fetching wheel state:', err);
        setError(errorMessage);
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