import { useState } from "react";
import { DeleteButton } from "./actions/DeleteButton";
import { LikeButton } from "./actions/LikeButton";
import { useToast } from "@/hooks/use-toast";
import { useLikeActions } from "@/hooks/useLikeActions";
import { useRealtimeLikes } from "@/hooks/useRealtimeLikes";
import { formatNumber } from "@/utils/formatNumber";
import { Meme } from "@/types/meme";

interface MemeCardActionsProps {
  meme: Pick<Meme, 'id' | 'is_featured' | 'created_by' | 'title' | 'likes'>;
  userLikes?: string[];
  userPoints?: number;
  userId?: string | null;
  isFirst?: boolean;
  className?: string;
}

export const MemeCardActions = ({
  meme,
  userLikes = [],
  userPoints = 0,
  userId,
  isFirst,
  className = ""
}: MemeCardActionsProps) => {
  const { toast } = useToast();
  const [isLiking, setIsLiking] = useState(false);
  const { handleLike, handleUnlike, isProcessing } = useLikeActions(meme.id.toString(), userId);
  const isLiked = userLikes?.includes(meme.id.toString());

  // Subscribe to real-time updates
  useRealtimeLikes(meme.id);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like memes",
        variant: "destructive"
      });
      return;
    }

    if (isLiking || isProcessing) return;

    try {
      setIsLiking(true);
      if (isLiked) {
        await handleUnlike();
      } else {
        if (userPoints < 1) {
          toast({
            title: "Not enough points",
            description: "You need at least 1 point to like a meme",
            variant: "destructive",
          });
          return;
        }
        await handleLike();
      }
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className={`flex items-center justify-between px-4 py-4 mt-2 border-t ${className}`}>
      <div className="flex items-center space-x-4">
        <LikeButton
          isLiked={isLiked}
          onClick={handleLikeClick}
          disabled={isLiking || isProcessing}
          likesCount={meme.likes}
        />
        <span className="text-sm font-medium transition-all duration-200">
          {formatNumber(meme.likes || 0)}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <DeleteButton meme={{ ...meme, id: meme.id.toString() }} userId={userId} />
      </div>
    </div>
  );
};