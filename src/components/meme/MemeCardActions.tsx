import { useState } from "react";
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
  const { handleLike, handleUnlike } = useLikeActions(meme.id.toString(), userId);

  const isLiked = userLikes?.includes(meme.id.toString());
  const [isAuthenticated, setIsAuthenticated] = useState(!!userId);

  const onAuthRequired = () => {
    toast({
      title: "Authentication Required",
      description: "Please log in to perform this action",
      variant: "destructive"
    });
  };

  const handleLikeClick = async () => {
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }

    if (isLiking) return;

    try {
      setIsLiking(true);
      if (isLiked) {
        await handleUnlike();
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

        await handleLike();
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
    <div className={`flex items-center justify-between px-4 py-4 mt-2 border-t ${className}`}>
      <div className="flex items-center space-x-4">
        <LikeButton
          isLiked={isLiked}
          onClick={handleLikeClick}
          disabled={isLiking}
          likesCount={meme.likes}
        />
        <span className="text-sm font-medium">
          {formatNumber(meme.likes || 0)}
        </span>
        <WatchlistButton
          memeId={meme.id.toString()}
          userId={userId}
          onAuthRequired={onAuthRequired}
        />
      </div>
      <div className="flex items-center space-x-2">
        <EditButton meme={{ ...meme, id: meme.id.toString() }} userId={userId} />
        <DeleteButton meme={{ ...meme, id: meme.id.toString() }} userId={userId} />
      </div>
    </div>
  );
};