import { useState } from "react";
import { cn } from "@/lib/utils";
import { WheelState } from "@/types/wheel";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

const WHEEL_API_URL = "https://api.memecawheel.xyz/wheel-state";
const REFRESH_INTERVAL = 300000; // 5 minutes

export const WheelWidget = () => {
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  const { data: wheelState, error } = useQuery({
    queryKey: ['wheelState'],
    queryFn: async (): Promise<WheelState> => {
      console.log("Fetching wheel state from API", {
        timestamp: new Date().toISOString(),
        url: WHEEL_API_URL
      });

      const response = await fetch(WHEEL_API_URL);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return response.json();
    },
    refetchInterval: REFRESH_INTERVAL,
    meta: {
      onSuccess: () => {
        console.log("Wheel state updated successfully", {
          timestamp: new Date().toISOString()
        });
        setConnectionStatus('connected');
        toast({
          title: "Success",
          description: "Wheel state updated",
          variant: "default",
        });
      },
      onError: (error: Error) => {
        console.error("Failed to fetch wheel state", {
          error,
          timestamp: new Date().toISOString()
        });
        setConnectionStatus('error');
        toast({
          title: "Error",
          description: "Failed to update wheel state",
          variant: "destructive",
        });
      }
    }
  });

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
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50">
            <div className="text-xs text-red-500 text-center p-2">
              Failed to load wheel data
            </div>
          </div>
        )}

        {wheelState && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="absolute top-2 left-2 right-2 z-10 flex justify-between items-center">
              <span className="text-xs bg-black/50 text-white px-2 py-1 rounded-full">
                Slot {wheelState.currentSlot}
              </span>
              <span className="text-xs bg-black/50 text-white px-2 py-1 rounded-full">
                {Math.floor(wheelState.nextUpdateIn / 60)}:{(wheelState.nextUpdateIn % 60).toString().padStart(2, '0')}
              </span>
            </div>
            
            {wheelState.imageUrl && (
              <img 
                src={wheelState.imageUrl} 
                alt={`Slot ${wheelState.currentSlot}`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};