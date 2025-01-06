import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  isLiked: boolean;
  onClick: () => void;
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
      className={`hover:text-red-500 ${isLiked ? 'text-red-500' : ''}`}
    >
      <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
    </Button>
  );
};