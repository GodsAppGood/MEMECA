import { EditButton } from "./actions/EditButton";
import { LikeButton } from "./actions/LikeButton";

interface MemeCardActionsProps {
  meme: {
    id: string;
    likes: number;
    created_by?: string;
  };
  userLikes: string[];
  userPoints: number;
  userId: string | null;
  isFirst?: boolean;
}

export const MemeCardActions = ({ 
  meme, 
  userLikes, 
  userPoints, 
  userId,
  isFirst 
}: MemeCardActionsProps) => {
  return (
    <div className="flex gap-2">
      <EditButton meme={meme} userId={userId} />
      <LikeButton
        meme={meme}
        userLikes={userLikes}
        userPoints={userPoints}
        userId={userId}
        isFirst={isFirst}
      />
    </div>
  );
};