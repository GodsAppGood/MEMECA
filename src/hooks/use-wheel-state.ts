import { useState, useEffect } from 'react';
import { WheelState } from '@/types/wheel';
import { toast } from 'sonner';

const POLLING_INTERVAL = 5000; // 5 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds
const WHEEL_API_URL = 'https://omdhcgwcplbgfvjtrswe.supabase.co/functions/v1/wheel-state';

export const useWheelState = () => {
  const [wheelState, setWheelState] = useState<WheelState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchWheelState = async () => {
      try {
        console.log('Fetching wheel state, attempt:', retryCount + 1);
        
        const response = await fetch(WHEEL_API_URL, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data) {
          throw new Error('No data received from wheel-state function');
        }

        console.log('Wheel state fetched successfully:', data);
        setWheelState(data);
        setError(null);
        setRetryCount(0);
      } catch (err) {
        console.error('Error fetching wheel state:', err);
        
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying in ${RETRY_DELAY}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
          setRetryCount(prev => prev + 1);
          setTimeout(fetchWheelState, RETRY_DELAY);
          return;
        }
        
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        setRetryCount(0);
        toast.error('Failed to fetch wheel state', {
          description: 'Please try again later'
        });
      } finally {
        if (retryCount >= MAX_RETRIES) {
          setIsLoading(false);
        }
      }
    };

    // Initial fetch
    fetchWheelState();

    // Set up polling with cleanup
    const intervalId = setInterval(() => {
      setRetryCount(0);
      fetchWheelState();
    }, POLLING_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, [retryCount]);

  return { wheelState, isLoading, error };
};