import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { MemeCardActions } from "./MemeCardActions";
import { MemeCardImage } from "./MemeCardImage";
import { CountdownTimer } from "./CountdownTimer";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";

interface UnifiedMemeCardProps {
  meme: {
    id: string;
    title: string;
    description?: string;
    image_url: string;
    created_at: string;
    likes: number;
    created_by?: string;
    time_until_listing?: string;
    is_featured?: boolean;
    tuzemoon_until?: string | null;
  };
  userLikes: string[];
  userPoints: number;
  userId: string | null;
  position?: number;
  isFirst?: boolean;
}

export const UnifiedMemeCard = ({ 
  meme, 
  userLikes, 
  userPoints, 
  userId,
  position,
  isFirst 
}: UnifiedMemeCardProps) => {
  const navigate = useNavigate();
  const isTuzemoon = meme.is_featured && meme.tuzemoon_until && new Date(meme.tuzemoon_until) > new Date();

  const handleCardClick = () => {
    if (!meme.id) return;
    navigate(`/meme/${meme.id}`);
  };

  return (
    <Card 
      className={`overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer relative flex flex-col h-full
        ${isFirst ? 'border-2 border-yellow-400' : ''}
        ${isTuzemoon ? 'animate-pulse-border' : ''}`}
      onClick={handleCardClick}
    >
      <MemeCardImage
        imageUrl={meme.image_url}
        title={meme.title}
        position={position}
        isFirst={isFirst}
      />
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold line-clamp-2">{meme.title}</h3>
              {isTuzemoon && (
                <Badge className="bg-red-500 text-white animate-pulse">
                  <Flame className="w-4 h-4 mr-1" />
                  Hot
                </Badge>
              )}
            </div>
            {meme.time_until_listing && (
              <CountdownTimer listingTime={meme.time_until_listing} />
            )}
          </div>
          <MemeCardActions
            meme={meme}
            userLikes={userLikes}
            userPoints={userPoints}
            userId={userId}
            isFirst={isFirst}
          />
        </div>
        {meme.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-4 flex-grow">
            {meme.description}
          </p>
        )}
        <span className="text-sm text-muted-foreground mt-auto">
          {format(new Date(meme.created_at), 'PPP')}
        </span>
      </div>
    </Card>
  );
};