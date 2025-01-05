import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditButton } from "./actions/EditButton";
import { DeleteButton } from "./actions/DeleteButton";
import { LikeButton } from "./actions/LikeButton";
import { WatchlistButton } from "./actions/WatchlistButton";
import { useToast } from "@/hooks/use-toast";
import { useLikeActions } from "@/hooks/useLikeActions";
import { formatNumber } from "@/utils/formatNumber";
import { Meme } from "@/types/meme";

interface MemeCardActionsProps {
  meme: Pick<Meme, 'id' | 'is_featured' | 'created_by' | 'title' | 'likes'>;
  userLikes?: string[];
  userPoints?: number;
  userId?: string | null;
  isAuthenticated: boolean;
  onAuthRequired: () => void;
}

export const MemeCardActions = ({
  meme,
  userLikes = [],
  userPoints = 0,
  userId,
  isAuthenticated,
  onAuthRequired,
}: MemeCardActionsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLiking, setIsLiking] = useState(false);
  const { handleLike, handleUnlike } = useLikeActions();

  const isLiked = userLikes?.includes(meme.id.toString());

  const handleLikeClick = async () => {
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }

    if (isLiking) return;

    try {
      setIsLiking(true);
      if (isLiked) {
        await handleUnlike(meme.id.toString());
        toast({
          title: "Unlike successful",
          description: "You've removed your like from this meme",
        });
      } else {
        if (userPoints < 1) {
          toast({
            title: "Not enough points",
            description: "You need at least 1 point to like a meme",
            variant: "destructive",
          });
          return;
        }

        await handleLike(meme.id.toString());
        toast({
          title: "Like successful",
          description: "You've liked this meme",
        });
      }
    } catch (error) {
      console.error('Error handling like:', error);
      toast({
        title: "Error",
        description: "Failed to process like action",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center space-x-2">
        <LikeButton
          isLiked={isLiked}
          onClick={handleLikeClick}
          disabled={isLiking}
        />
        <span className="text-sm font-medium">
          {formatNumber(meme.likes || 0)}
        </span>
        <WatchlistButton
          memeId={meme.id.toString()}
          isAuthenticated={isAuthenticated}
          onAuthRequired={onAuthRequired}
        />
      </div>
      <EditButton meme={meme} userId={userId || null} />
      <DeleteButton meme={meme} userId={userId || null} />
    </div>
  );
};