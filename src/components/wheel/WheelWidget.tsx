import { useState } from "react";

export const WheelWidget = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="fixed bottom-36 right-4 z-50 rounded-full overflow-hidden shadow-lg bg-white/80 backdrop-blur-sm">
      <div className={`w-[150px] h-[150px] transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
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