import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { WheelState } from "@/types/wheel";
import { toast } from "sonner";

const ALLOWED_ORIGINS = [
  'https://memecawheel.xyz',
  'https://www.memecawheel.xyz',
  'https://memewheel.xyz',
  'https://www.memewheel.xyz'
];

// Add development domains if not in production
if (import.meta.env.DEV) {
  ALLOWED_ORIGINS.push('https://lovable.dev');
  ALLOWED_ORIGINS.push('https://localhost:3000');
}

export const WheelWidget = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [wheelState, setWheelState] = useState<WheelState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastMessageTime, setLastMessageTime] = useState<Date | null>(null);

  useEffect(() => {
    const handleWheelMessage = (event: MessageEvent) => {
      const timestamp = new Date();
      
      console.log("Widget: Received message", {
        timestamp: timestamp.toISOString(),
        origin: event.origin,
        data: event.data,
        allowedOrigins: ALLOWED_ORIGINS
      });

      // Validate origin
      if (!ALLOWED_ORIGINS.includes(event.origin)) {
        console.warn("Widget: Unauthorized origin", {
          received: event.origin,
          allowed: ALLOWED_ORIGINS,
          timestamp: timestamp.toISOString()
        });
        return;
      }

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
          console.log("Widget: Processing wheel state", {
            state: data.data,
            timestamp: timestamp.toISOString()
          });
          
          setWheelState(data.data as WheelState);
          setError(null);
          setLastMessageTime(timestamp);
          
          // Notify on successful update
          toast.success("Wheel state updated");
        } else {
          console.warn("Widget: Unexpected message type", { 
            type: data.type,
            data: data,
            timestamp: timestamp.toISOString()
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error("Widget: Processing error", {
          error: err,
          message: errorMessage,
          timestamp: timestamp.toISOString()
        });
        setError(`Failed to process wheel data: ${errorMessage}`);
        toast.error("Failed to load wheel data");
      }
    };

    console.log("Widget: Initializing message listener", {
      timestamp: new Date().toISOString(),
      allowedOrigins: ALLOWED_ORIGINS
    });
    
    window.addEventListener("message", handleWheelMessage);

    // Check for stale data every minute
    const intervalId = setInterval(() => {
      if (lastMessageTime && (new Date().getTime() - lastMessageTime.getTime() > 360000)) {
        console.warn("Widget: No updates received for 6 minutes", {
          lastUpdate: lastMessageTime.toISOString(),
          current: new Date().toISOString()
        });
        toast.warning("Wheel data may be stale");
      }
    }, 60000);

    return () => {
      console.log("Widget: Cleaning up", {
        timestamp: new Date().toISOString()
      });
      window.removeEventListener("message", handleWheelMessage);
      clearInterval(intervalId);
    };
  }, [lastMessageTime]);

  return (
    <div className="fixed bottom-36 right-4 z-50">
      <div className={cn(
        "w-28 h-28 relative rounded-full overflow-hidden border-2 border-[#02E6F6] shadow-lg bg-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-105",
        isLoaded ? 'opacity-100' : 'opacity-0'
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
          src="https://memecawheel.xyz/widget-view?mode=embed&section=wheel-only"
          className="w-full h-full"
          onLoad={() => {
            console.log("Widget: iframe loaded", {
              timestamp: new Date().toISOString(),
              url: 'https://memecawheel.xyz/widget-view',
              params: { mode: 'embed', section: 'wheel-only' }
            });
            setIsLoaded(true);
            toast.success("Widget initialized");
          }}
          title="Meme Wheel Widget"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  );
};