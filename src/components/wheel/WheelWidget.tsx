import { useState } from "react";

export const WheelWidget = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-50 rounded-full overflow-hidden shadow-lg bg-white/80 backdrop-blur-sm">
      <div className={`w-[200px] h-[200px] transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
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