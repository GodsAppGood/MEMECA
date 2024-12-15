import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useLikeMutation } from "@/hooks/useLikeMutation";

interface LikeButtonProps {
  meme: {
    id: string;
    likes: number;
  };
  userLikes: string[];
  userPoints: number;
  userId: string | null;
  isFirst?: boolean;
}

export const LikeButton = ({ 
  meme, 
  userLikes, 
  userPoints, 
  userId,
  isFirst 
}: LikeButtonProps) => {
  const hasLiked = userLikes.includes(meme.id);

  const { mutate: handleLike, isPending } = useLikeMutation({
    memeId: meme.id,
    currentLikes: meme.likes,
    userId,
    userLikes,
    userPoints
  });

  if (isFirst) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.stopPropagation();
        if (!isPending) {
          handleLike();
        }
      }}
      className="hover:text-red-500"
      disabled={userPoints <= 0 && !hasLiked}
    >
      <Heart 
        className={`h-4 w-4 ${
          hasLiked ? 'fill-red-500 text-red-500' : ''
        }`} 
      />
      <span className="ml-1">{meme.likes || 0}</span>
    </Button>
  );
};