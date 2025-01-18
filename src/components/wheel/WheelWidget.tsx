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
      // Verify origin - allow both www and non-www versions
      if (!event.origin.match(/^https:\/\/(www\.)?memecawheel\.xyz$/)) {
        console.warn("Received message from unauthorized origin:", event.origin);
        return;
      }

      try {
        const data = event.data;
        if (data && typeof data === "object") {
          console.log("Received wheel data:", data);
          setWheelState(data as WheelState);
          setError(null);
        }
      } catch (err) {
        console.error("Error processing wheel message:", err);
        setError("Failed to process wheel data");
        toast.error("Failed to load wheel data", {
          description: "Please try again later"
        });
      }
    };

    window.addEventListener("message", handleWheelMessage);
    return () => window.removeEventListener("message", handleWheelMessage);
  }, []);

  return (
    <div className="fixed bottom-36 right-4 z-50 rounded-full overflow-hidden shadow-lg bg-white/80 backdrop-blur-sm">
      <div className={cn(
        "w-28 h-28 relative",
        isLoaded ? 'opacity-100' : 'opacity-0',
        'transition-opacity duration-300'
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
          src="https://www.memecawheel.xyz?mode=widget&embed=true"
          className="w-full h-full"
          onLoad={() => setIsLoaded(true)}
          title="Meme Wheel Widget"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  );
};