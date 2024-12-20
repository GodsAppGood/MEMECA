import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { MemeCardActions } from "./MemeCardActions";
import { MemeCardImage } from "./MemeCardImage";
import { CountdownTimer } from "./CountdownTimer";

interface TopMemeCardProps {
  meme: {
    id: string;
    title: string;
    image_url: string;
    likes: number;
    created_by?: string;
    isPlaceholder?: boolean;
    time_until_listing?: string;
  };
  position: number;
  userLikes: string[];
  userPoints: number;
  userId: string | null;
  isFirst: boolean;
}

export const TopMemeCard = ({ 
  meme, 
  position, 
  userLikes, 
  userPoints, 
  userId,
  isFirst 
}: TopMemeCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (!meme.isPlaceholder) {
      navigate(`/meme/${meme.id}`);
    }
  };

  return (
    <Card 
      className={`overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer ${
        isFirst ? 'border-2 border-yellow-400' : ''
      } ${meme.isPlaceholder ? 'opacity-50' : ''}`}
      onClick={handleCardClick}
    >
      <MemeCardImage
        imageUrl={meme.image_url}
        title={meme.title}
        position={position}
        isFirst={isFirst}
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{meme.title}</h3>
            {meme.time_until_listing && !meme.isPlaceholder && (
              <CountdownTimer listingTime={meme.time_until_listing} />
            )}
          </div>
          {!meme.isPlaceholder && (
            <MemeCardActions
              meme={meme}
              userLikes={userLikes}
              userPoints={userPoints}
              userId={userId}
              isFirst={isFirst}
            />
          )}
        </div>
      </div>
    </Card>
  );
};