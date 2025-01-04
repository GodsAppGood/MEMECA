import { useEffect, useRef, useState } from 'react';

interface Vector {
  x: number;
  y: number;
}

export const RocketAnimation = () => {
  const [position, setPosition] = useState<Vector>({ x: 100, y: 100 });
  const [velocity, setVelocity] = useState<Vector>({ x: 3, y: 2 });
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef<Vector>({ x: 0, y: 0 });

  useEffect(() => {
    if (isPaused || isDragging) return;

    const animate = () => {
      setPosition(prev => {
        const container = containerRef.current;
        if (!container) return prev;

        const rocketSize = 80; // Approximate size of rocket
        const newX = prev.x + velocity.x;
        const newY = prev.y + velocity.y;
        let newVelX = velocity.x;
        let newVelY = velocity.y;

        // Bounce off walls
        if (newX <= 0 || newX >= container.clientWidth - rocketSize) {
          newVelX = -velocity.x;
        }
        if (newY <= 0 || newY >= container.clientHeight - rocketSize) {
          newVelY = -velocity.y;
        }

        // Update velocity if changed
        if (newVelX !== velocity.x || newVelY !== velocity.y) {
          setVelocity({ x: newVelX, y: newVelY });
        }

        // Calculate rotation based on velocity
        const angle = Math.atan2(newVelY, newVelX) * (180 / Math.PI);
        setRotation(angle + 90); // Add 90 degrees to point rocket nose in direction of travel

        return {
          x: Math.max(0, Math.min(newX, container.clientWidth - rocketSize)),
          y: Math.max(0, Math.min(newY, container.clientHeight - rocketSize))
        };
      });
    };

    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [velocity, isPaused, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only handle left click
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    setIsDragging(true);
    setIsPaused(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const rocketSize = 80;
    
    setPosition({
      x: Math.max(0, Math.min(
        e.clientX - containerRect.left - dragOffset.current.x,
        container.clientWidth - rocketSize
      )),
      y: Math.max(0, Math.min(
        e.clientY - containerRect.top - dragOffset.current.y,
        container.clientHeight - rocketSize
      ))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const togglePause = () => {
    if (!isDragging) {
      setIsPaused(!isPaused);
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-10"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <img
        src="/lovable-uploads/e47a16cc-6366-4005-b225-ba49db18c13a.png"
        alt="Rocket"
        className={`absolute w-20 h-20 cursor-pointer pointer-events-auto transition-transform
          ${isPaused ? 'opacity-70' : 'opacity-100'}
          ${isDragging ? 'scale-110' : 'hover:scale-105'}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `rotate(${rotation}deg)`,
        }}
        onMouseDown={handleMouseDown}
        onClick={togglePause}
        draggable={false}
      />
    </div>
  );
};