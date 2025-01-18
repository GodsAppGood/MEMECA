import { useState, useEffect } from 'react';
import { WheelState } from '@/types/wheel';
import { supabase } from "@/integrations/supabase/client";

const WHEEL_API_URL = 'https://omdhcgwcplbgfvjtrswe.supabase.co/functions/v1/wheel-state';
const POLLING_INTERVAL = 5000; // 5 seconds

export const useWheelState = () => {
  const [wheelState, setWheelState] = useState<WheelState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWheelState = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        const response = await fetch(WHEEL_API_URL, {
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'apikey': process.env.VITE_SUPABASE_ANON_KEY || '',
          }
        });

        if (!response.ok) {
          console.error('Wheel state fetch error:', {
            status: response.status,
            statusText: response.statusText
          });
          throw new Error('Failed to fetch wheel state');
        }

        const data: WheelState = await response.json();
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