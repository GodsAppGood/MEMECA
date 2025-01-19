import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { WheelState } from "@/types/wheel";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/meme/ui/LoadingSpinner";
import { ErrorState } from "@/components/meme/ui/ErrorState";

const FALLBACK_STATE: WheelState = {
  currentSlot: 1,
  nextUpdateIn: 300,
  imageUrl: null,
  totalSlots: 24,
  isActive: true
};

export const WheelWidget = () => {
  const [wheelState, setWheelState] = useState<WheelState>(FALLBACK_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchWheelState = async () => {
      try {
        const { data, error } = await supabase
          .from('WidgetSlots')
          .select(`
            id,
            slot_number,
            meme_id,
            Memes (
              image_url
            )
          `)
          .eq('is_active', true)
          .single();

        if (error) throw error;

        if (data) {
          setWheelState({
            currentSlot: data.slot_number,
            nextUpdateIn: 300, // 5 minutes in seconds
            imageUrl: data.Memes?.image_url || null,
            totalSlots: 24,
            isActive: true
          });
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching wheel state:', err);
        setError(err as Error);
        setIsLoading(false);
      }
    };

    fetchWheelState();
    const interval = setInterval(fetchWheelState, 5000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed bottom-36 right-4 z-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed bottom-36 right-4 z-50">
        <ErrorState 
          message="Unable to connect to wheel state" 
          error={error}
          onRetry={() => setError(null)}
        />
      </div>
    );
  }

  return (
    <div className="fixed bottom-36 right-4 z-50">
      <div className={cn(
        "w-28 h-28 relative rounded-full overflow-hidden border-2 shadow-lg bg-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-105",
        "animate-float", // Анимация из memecawheel.xyz
        "hover:border-[#02E6F6] hover:shadow-[0_0_15px_rgba(2,230,246,0.5)]" // Эффект наведения из memecawheel.xyz
      )}>
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
    </div>
  );
};