import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { WheelState } from "@/types/wheel";
import { toast } from "sonner";

export const WheelWidget = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [wheelState, setWheelState] = useState<WheelState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleWheelMessage = (event: MessageEvent) => {
      // Log all incoming messages for debugging
      console.log("Received message from:", event.origin);
      console.log("Message data:", event.data);

      const allowedOrigins = [
        'https://memecawheel.xyz',
        'https://www.memecawheel.xyz'
      ];

      if (!allowedOrigins.includes(event.origin)) {
        console.warn("Unauthorized origin:", event.origin);
        console.warn("Expected origins:", allowedOrigins);
        return;
      }

      try {
        const data = event.data;
        
        // Validate message structure
        if (!data || typeof data !== "object") {
          console.error("Invalid message format:", data);
          return;
        }

        // Check if it's a wheel state message
        if (data.type === 'wheelState' && data.data) {
          console.log("Valid wheel state received:", data.data);
          setWheelState(data.data as WheelState);
          setError(null);
        } else {
          console.warn("Unexpected message type:", data);
        }
      } catch (err) {
        console.error("Error processing wheel message:", err);
        setError("Failed to process wheel data");
        toast.error("Failed to load wheel data", {
          description: "Please try again later"
        });
      }
    };

    // Log when listener is attached
    console.log("Attaching wheel message listener");
    window.addEventListener("message", handleWheelMessage);

    return () => {
      console.log("Removing wheel message listener");
      window.removeEventListener("message", handleWheelMessage);
    };
  }, []);

  return (
    <div className="fixed bottom-36 right-4 z-50">
      <div className={cn(
        "w-28 h-28 relative rounded-full overflow-hidden border-2 border-[#02E6F6] shadow-lg bg-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-105",
        isLoaded ? 'opacity-100' : 'opacity-0',
      )}>
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50">
            <div className="text-xs text-red-500 text-center p-2">
              Failed to load wheel
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
            console.log("Widget iframe loaded");
            setIsLoaded(true);
          }}
          title="Meme Wheel Widget"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  );
};