import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";

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
        group
        relative
        transition-all duration-200 ease-in-out
        hover:scale-110
        active:scale-95
        ${isLiked ? 'text-red-500' : 'hover:text-red-500'}
        ${disabled && !isLiked ? 'cursor-not-allowed opacity-50' : ''}
      `}
      aria-label={isLiked ? 'Unlike' : 'Like'}
      title={disabled && !isLiked ? 'Please verify your account to like memes' : `${likesCount} ${likesCount === 1 ? 'like' : 'likes'}`}
    >
      {disabled && !isLiked ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart 
          className={`
            h-4 w-4 
            transition-all duration-300
            group-hover:animate-bounce
            ${isLiked ? 'fill-current animate-scale-in' : ''}
          `} 
        />
      )}
    </Button>
  );
};