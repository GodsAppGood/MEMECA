import { useState } from "react";
import { cn } from "@/lib/utils";
import { WheelState } from "@/types/wheel";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

const WHEEL_API_URL = "https://omdhcgwcplbgfvjtrswe.functions.supabase.co/wheel-state";
const REFRESH_INTERVAL = 300000; // 5 minutes
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 5000; // 5 seconds
const STALE_TIME = 30000; // 30 seconds

const FALLBACK_STATE: WheelState = {
  currentSlot: 1,
  nextUpdateIn: 300,
  imageUrl: null,
  totalSlots: 24,
  isActive: true
};

export const WheelWidget = () => {
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [retryCount, setRetryCount] = useState(0);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [responseTime, setResponseTime] = useState<number>(0);

  const { data: wheelState } = useQuery({
    queryKey: ['wheelState', retryCount],
    queryFn: async (): Promise<WheelState> => {
      const startTime = performance.now();
      
      try {
        console.log("Attempting to fetch wheel state", {
          timestamp: new Date().toISOString(),
          attempt: retryCount + 1,
          url: WHEEL_API_URL,
          origin: window.location.origin,
          headers: {
            'Accept': 'application/json',
            'Origin': window.location.origin
          }
        });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
          throw new Error('Request timeout');
        }, REQUEST_TIMEOUT);

        const response = await fetch(WHEEL_API_URL, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
            'Origin': window.location.origin
          },
          mode: 'cors',
          credentials: 'omit',
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        
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
          headers: Object.fromEntries(response.headers.entries()),
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
          retryCount,
          responseTime: `${endTime - startTime}ms`,
          url: WHEEL_API_URL,
          origin: window.location.origin
        });
        
        if (retryCount >= MAX_RETRIES) {
          console.log("Using fallback state after multiple retries");
          setIsUsingFallback(true);
          setConnectionStatus('error');
          return FALLBACK_STATE;
        }
        
        setRetryCount(prev => prev + 1);
        throw err;
      }
    },
    refetchInterval: REFRESH_INTERVAL,
    retry: MAX_RETRIES,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
    staleTime: STALE_TIME,
    meta: {
      onSuccess: () => {
        if (!isUsingFallback) {
          console.log("Wheel state updated successfully", {
            timestamp: new Date().toISOString(),
            responseTime: `${responseTime}ms`
          });
          setConnectionStatus('connected');
          toast({
            title: "Wheel Connected",
            description: "Successfully connected to MeMeCa Wheel",
            variant: "default",
          });
        }
      },
      onError: (error: Error) => {
        console.log("Error fetching wheel state", {
          error,
          attempt: retryCount + 1,
          timestamp: new Date().toISOString(),
          responseTime: `${responseTime}ms`
        });
        
        setConnectionStatus('error');
        
        if (retryCount <= MAX_RETRIES) {
          toast({
            title: "Connection Error",
            description: "Unable to connect to MeMeCa Wheel. Retrying...",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Connection Error",
            description: "Unable to connect to MeMeCa Wheel. Using cached state.",
            variant: "destructive",
          });
        }
      }
    }
  });

  // Use fallback or actual data
  const displayState = wheelState || FALLBACK_STATE;

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