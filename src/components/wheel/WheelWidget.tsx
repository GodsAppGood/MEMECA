import { useState } from "react";
import { useWheelState } from "@/hooks/use-wheel-state";
import { cn } from "@/lib/utils";

export const WheelWidget = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { wheelState, isLoading, error } = useWheelState();

  return (
    <div className="fixed bottom-36 right-4 z-50 rounded-full overflow-hidden shadow-lg bg-white/80 backdrop-blur-sm">
      <div className={cn(
        "w-28 h-28 relative",
        isLoaded ? 'opacity-100' : 'opacity-0',
        'transition-opacity duration-300'
      )}>
        {isLoading && !isLoaded && (
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
          src="https://memecawheel.xyz/widget"
          className="w-full h-full"
          onLoad={() => setIsLoaded(true)}
          title="Meme Wheel Widget"
        />
      </div>
    </div>
  );
};