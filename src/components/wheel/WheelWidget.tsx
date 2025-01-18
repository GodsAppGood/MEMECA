import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { WheelState } from "@/types/wheel";
import { toast } from "sonner";

export const WheelWidget = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [wheelState, setWheelState] = useState<WheelState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastMessageTime, setLastMessageTime] = useState<Date | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  useEffect(() => {
    const handleWheelMessage = (event: MessageEvent) => {
      const timestamp = new Date();
      
      console.log("Widget: Received message", {
        timestamp: timestamp.toISOString(),
        origin: event.origin,
        data: event.data
      });

      try {
        const data = event.data;
        
        if (!data || typeof data !== "object") {
          console.error("Widget: Invalid message format", { 
            data,
            timestamp: timestamp.toISOString() 
          });
          return;
        }

        if (data.type === 'wheelState' && data.data) {
          console.log("Widget: Valid wheel state received", {
            state: data.data,
            timestamp: timestamp.toISOString()
          });
          
          setWheelState(data.data as WheelState);
          setError(null);
          setLastMessageTime(timestamp);
          setConnectionStatus('connected');
          
          toast.success("Wheel state updated");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error("Widget: Processing error", {
          error: err,
          message: errorMessage,
          timestamp: timestamp.toISOString()
        });
        setError(`Failed to process wheel data: ${errorMessage}`);
        setConnectionStatus('error');
        toast.error("Failed to process wheel data");
      }
    };

    window.addEventListener("message", handleWheelMessage);

    // Check connection status every minute
    const intervalId = setInterval(() => {
      if (lastMessageTime) {
        const timeSinceLastMessage = new Date().getTime() - lastMessageTime.getTime();
        if (timeSinceLastMessage > 360000) { // 6 minutes
          setConnectionStatus('error');
          toast.warning("Connection to wheel may be lost");
        }
      }
    }, 60000);

    return () => {
      window.removeEventListener("message", handleWheelMessage);
      clearInterval(intervalId);
    };
  }, [lastMessageTime]);

  return (
    <div className="fixed bottom-36 right-4 z-50">
      <div className={cn(
        "w-28 h-28 relative rounded-full overflow-hidden border-2 shadow-lg bg-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-105",
        {
          'border-[#02E6F6]': connectionStatus === 'connected',
          'border-yellow-500': connectionStatus === 'connecting',
          'border-red-500': connectionStatus === 'error',
          'opacity-0': !isLoaded,
          'opacity-100': isLoaded
        }
      )}>
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50">
            <div className="text-xs text-red-500 text-center p-2">
              {error}
            </div>
          </div>
        )}

        {wheelState && (
          <div className="absolute top-2 left-2 right-2 z-10 flex justify-between items-center">
            <span className="text-xs bg-black/50 text-white px-2 py-1 rounded-full">
              Slot {wheelState.currentSlot}
            </span>
            <span className="text-xs bg-black/50 text-white px-2 py-1 rounded-full">
              {Math.floor(wheelState.nextUpdateIn / 60)}:{(wheelState.nextUpdateIn % 60).toString().padStart(2, '0')}
            </span>
          </div>
        )}

        <iframe
          src="https://omdhcgwcplbgfvjtrswe.functions.supabase.co/widget-embed"
          className="w-full h-full"
          style={{ border: 'none', background: 'transparent' }}
          onLoad={() => {
            console.log("Widget: iframe loaded", {
              timestamp: new Date().toISOString()
            });
            setIsLoaded(true);
            toast.success("Widget initialized");
          }}
          title="Meme Wheel Widget"
        />
      </div>
    </div>
  );
};