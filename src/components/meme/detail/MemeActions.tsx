import { WatchlistButton } from "../actions/WatchlistButton";
import { TuzemoonButton } from "./TuzemoonButton";

interface MemeActionsProps {
  memeId: string;
  userId: string | null;
  isAdmin: boolean;
  isVerified: boolean;
  isFeatured: boolean;
  onUpdate: () => Promise<any>;
}

export const MemeActions = ({
  memeId,
  userId,
  isAdmin,
  isVerified,
  isFeatured,
  onUpdate
}: MemeActionsProps) => {
  return (
    <div className="flex gap-2">
      {(isAdmin || isVerified) && (
        <>
          <WatchlistButton 
            memeId={memeId}
            userId={userId}
            showText={true}
            className="mr-2"
          />
          <TuzemoonButton
            memeId={memeId}
            isFeatured={isFeatured}
            isAdmin={isAdmin}
            isVerified={isVerified}
            onUpdate={onUpdate}
          />
        </>
      )}
    </div>
  );
};