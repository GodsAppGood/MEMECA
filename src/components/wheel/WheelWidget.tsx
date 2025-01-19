import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { WheelState } from "@/types/wheel";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/meme/ui/LoadingSpinner";
import { ErrorState } from "@/components/meme/ui/ErrorState";

const WHEEL_API_URL = "https://omdhcgwcplbgfvjtrswe.functions.supabase.co/wheel-state";
const REFRESH_INTERVAL = 5000; // 5 seconds
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 15000; // 15 seconds
const STALE_TIME = 4000; // 4 seconds

const FALLBACK_STATE: WheelState = {
  currentSlot: 1,
  nextUpdateIn: 300,
  imageUrl: null,
  totalSlots: 24,
  isActive: true
};

export const WheelWidget = () => {
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [responseTime, setResponseTime] = useState<number>(0);
  
  // Refs for cleanup
  const abortControllerRef = useRef<AbortController>();
  const timeoutIdRef = useRef<number>();

  // Cleanup function
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  const fetchWheelState = async (): Promise<WheelState> => {
    const startTime = performance.now();
    
    try {
      console.log("Attempting to fetch wheel state", {
        timestamp: new Date().toISOString(),
        url: WHEEL_API_URL,
        origin: window.location.origin
      });

      // Create new AbortController for this request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      // Set timeout
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutIdRef.current = window.setTimeout(() => {
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
          }
          reject(new Error('Request timeout'));
        }, REQUEST_TIMEOUT);
      });

      const fetchPromise = fetch(WHEEL_API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'Origin': window.location.origin
        },
        mode: 'cors',
        credentials: 'omit',
        signal: abortControllerRef.current.signal
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]);
      
      // Clear timeout if fetch completed
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      
      const endTime = performance.now();
      setResponseTime(endTime - startTime);

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log("Wheel state fetched successfully", {
        timestamp: new Date().toISOString(),
        responseTime: `${endTime - startTime}ms`,
        status: response.status,
        data
      });

      setIsUsingFallback(false);
      setConnectionStatus('connected');
      return data;
    } catch (err) {
      const endTime = performance.now();
      setResponseTime(endTime - startTime);
      
      console.error("Failed to fetch wheel state", {
        error: err,
        timestamp: new Date().toISOString(),
        responseTime: `${endTime - startTime}ms`,
        url: WHEEL_API_URL,
        origin: window.location.origin
      });

      if (err.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw err;
    }
  };

  const { data: wheelState, error, isLoading, refetch } = useQuery({
    queryKey: ['wheelState'],
    queryFn: fetchWheelState,
    refetchInterval: REFRESH_INTERVAL,
    retry: MAX_RETRIES,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
    staleTime: STALE_TIME,
    meta: {
      onError: (error: Error) => {
        console.error("Wheel state fetch error:", {
          error,
          timestamp: new Date().toISOString(),
          responseTime: `${responseTime}ms`,
          origin: window.location.origin
        });
        
        setConnectionStatus('error');
        
        if (!isUsingFallback) {
          toast({
            title: "Connection Error",
            description: "Unable to connect to MeMeCa Wheel. Using cached state.",
            variant: "destructive",
          });
          setIsUsingFallback(true);
        }
      }
    }
  });

  // Monitor errors
  useEffect(() => {
    if (error) {
      console.error('Wheel state error:', {
        error,
        timestamp: new Date().toISOString(),
        origin: window.location.origin,
        responseTime: `${responseTime}ms`
      });
    }
  }, [error, responseTime]);

  // Use fallback or actual data
  const displayState = wheelState || FALLBACK_STATE;

  if (isLoading && !wheelState) {
    return (
      <div className="fixed bottom-36 right-4 z-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !wheelState) {
    return (
      <div className="fixed bottom-36 right-4 z-50">
        <ErrorState 
          message="Unable to connect to wheel state" 
          error={error}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="fixed bottom-36 right-4 z-50">
      <div className={cn(
        "w-28 h-28 relative rounded-full overflow-hidden border-2 shadow-lg bg-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-105",
        {
          'border-[#02E6F6]': connectionStatus === 'connected',
          'border-yellow-500': connectionStatus === 'connecting',
          'border-red-500': connectionStatus === 'error',
          'animate-pulse': connectionStatus === 'connecting'
        }
      )}>
        {connectionStatus === 'connecting' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        )}
        
        {connectionStatus === 'error' && !isUsingFallback && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50">
            <div className="text-xs text-red-500 text-center p-2">
              Connecting...
            </div>
          </div>
        )}

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="absolute top-2 left-2 right-2 z-10 flex justify-between items-center">
            <span className="text-xs bg-black/50 text-white px-2 py-1 rounded-full">
              Slot {displayState.currentSlot}
            </span>
            <span className="text-xs bg-black/50 text-white px-2 py-1 rounded-full">
              {Math.floor(displayState.nextUpdateIn / 60)}:{(displayState.nextUpdateIn % 60).toString().padStart(2, '0')}
            </span>
          </div>
          
          {displayState.imageUrl && (
            <img 
              src={displayState.imageUrl} 
              alt={`Slot ${displayState.currentSlot}`}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
    </div>
  );
};