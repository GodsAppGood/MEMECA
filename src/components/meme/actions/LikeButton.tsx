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
        transition-all duration-200 ease-in-out
        hover:text-red-500 hover:scale-110
        ${isLiked ? 'text-red-500 scale-105' : ''}
        ${disabled ? 'animate-pulse' : ''}
      `}
    >
      <Heart 
        className={`
          h-4 w-4 
          transition-all duration-200
          ${isLiked ? 'fill-current animate-scale-in' : ''}
        `} 
      />
    </Button>
  );
};