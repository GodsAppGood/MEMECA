import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  isLiked: boolean;
  onClick: (e: React.MouseEvent) => void;
  disabled: boolean;
  likesCount: number;
}

export const LikeButton = ({ isLiked, onClick, disabled, likesCount }: LikeButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      className={`
        relative
        transition-all duration-200 ease-in-out
        hover:text-red-500 hover:scale-110
        active:scale-95
        ${isLiked ? 'text-red-500 scale-105' : ''}
        ${disabled ? 'cursor-not-allowed opacity-50' : ''}
      `}
    >
      <Heart 
        className={`
          h-4 w-4 
          transition-all duration-200
          ${isLiked ? 'fill-current animate-scale-in' : ''}
          ${disabled ? 'animate-pulse' : ''}
        `} 
      />
      {disabled && (
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      )}
    </Button>
  );
};