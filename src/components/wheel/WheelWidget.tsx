import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

export const WheelWidget = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 170 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && widgetRef.current) {
        const newX = Math.min(
          Math.max(0, e.clientX - dragOffset.x),
          window.innerWidth - widgetRef.current.offsetWidth
        );
        const newY = Math.min(
          Math.max(0, e.clientY - dragOffset.y),
          window.innerHeight - widgetRef.current.offsetHeight
        );
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (widgetRef.current) {
      const rect = widgetRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={widgetRef}
      className="fixed z-50 cursor-move bg-white/80 backdrop-blur-sm rounded-lg p-4 relative"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsVisible(false);
        }}
        className="absolute -top-2 -right-2 z-10 rounded-full p-1.5 bg-black/50 hover:bg-black/70 transition-colors"
        aria-label="Close widget"
      >
        <X className="h-4 w-4 text-white pointer-events-none" />
      </button>
      <div 
        className={`w-[150px] h-[150px] transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <iframe
          src="https://memecawheel.xyz/widget"
          className="w-full h-full pointer-events-none"
          onLoad={() => setIsLoaded(true)}
          title="Meme Wheel Widget"
        />
      </div>
    </div>
  );
};