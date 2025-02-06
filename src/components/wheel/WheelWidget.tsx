
import { useState } from "react";
import { cn } from "@/lib/utils";
import { WheelState } from "@/types/wheel";
import { toast } from "sonner";

export const WheelWidget = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [wheelState, setWheelState] = useState<WheelState | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="fixed bottom-36 right-4 z-50">
      <div className={cn(
        "w-28 h-28 relative rounded-full overflow-hidden border-2 border-[#02E6F6] shadow-lg bg-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-105 animate-pulse-border-cyan",
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

        <iframe
          src="https://memecawheel.xyz/?mode=embed&section=wheel-only"
          className="w-full h-full"
          style={{
            width: '112px',
            height: '112px',
            border: 'none',
            position: 'absolute',
            top: '-3px',
            right: '-3px',
            background: 'transparent'
          }}
          onLoad={() => setIsLoaded(true)}
          title="Meme Wheel Widget"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  );
};

