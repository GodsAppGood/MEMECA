import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Loader2 } from "lucide-react";

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
      {disabled ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart 
          className={`
            h-4 w-4 
            transition-all duration-200
            ${isLiked ? 'fill-current animate-scale-in' : ''}
          `} 
        />
      )}
    </Button>
  );
};