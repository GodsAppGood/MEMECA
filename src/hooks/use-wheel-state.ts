import { useState, useEffect } from 'react';
import { WheelState } from '@/types/wheel';

const WHEEL_API_URL = 'https://omdhcgwcplbgfvjtrswe.supabase.co/functions/v1/wheel-state';
const POLLING_INTERVAL = 5000; // 5 seconds

export const useWheelState = () => {
  const [wheelState, setWheelState] = useState<WheelState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWheelState = async () => {
      try {
        const response = await fetch(WHEEL_API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch wheel state');
        }
        const data: WheelState = await response.json();
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