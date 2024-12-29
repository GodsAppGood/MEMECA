import { useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Game } from "./GameLogic";

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GameModal = ({ isOpen, onClose }: GameModalProps) => {
  const gameRef = useRef<Game | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && canvasRef.current && !gameRef.current) {
      gameRef.current = new Game('gameCanvas');
      gameRef.current.start();

      const handleResize = () => {
        if (gameRef.current) {
          gameRef.current.resize();
        }
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      return () => {
        window.removeEventListener('resize', handleResize);
        if (gameRef.current) {
          gameRef.current.stop();
          gameRef.current = null;
        }
      };
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] w-[800px] h-[600px] p-0">
        <canvas
          id="gameCanvas"
          ref={canvasRef}
          className="w-full h-full"
          style={{ touchAction: 'none' }}
        />
      </DialogContent>
    </Dialog>
  );
};