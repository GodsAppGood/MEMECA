import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { MemeCardActions } from "./MemeCardActions";
import { MemeCardImage } from "./MemeCardImage";
import { CountdownTimer } from "./CountdownTimer";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";
import { format } from "date-fns";

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

  const truncateTitle = (title: string, maxLength: number = 20) => {
    if (title.length <= maxLength) return title;
    return `${title.substring(0, maxLength)}...`;
  };

  return (
    <Card 
      className={`group overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer relative flex flex-col min-h-[450px] max-h-[600px] bg-gradient-to-b from-background to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl border-2
        ${isFirst ? 'ring-2 ring-[#FFB74D] shadow-lg shadow-[#FFB74D]/20' : 'border-[#FFB74D] hover:shadow-xl'}
        ${isTuzemoon ? 'animate-pulse-border' : ''}`}
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        <MemeCardImage
          imageUrl={meme.image_url}
          title={meme.title}
          position={position}
          isFirst={isFirst}
          className="h-48 md:h-56 lg:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {isTuzemoon && (
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow space-y-4">
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-2 flex-grow">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold line-clamp-1 break-words group-hover:text-primary transition-colors" 
                  title={meme.title}>
                {truncateTitle(meme.title)}
              </h3>
              {isTuzemoon && (
                <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white animate-pulse shrink-0">
                  <Flame className="w-4 h-4 mr-1" />
                  Hot
                </Badge>
              )}
            </div>
            {meme.time_until_listing && (
              <CountdownTimer listingTime={meme.time_until_listing} />
            )}
          </div>
        </div>

        {meme.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 break-words flex-grow">
            {meme.description}
          </p>
        )}

        <div className="flex flex-col space-y-4 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-muted-foreground">
            {format(new Date(meme.created_at), 'PPP')}
          </span>
          <MemeCardActions
            meme={meme}
            userLikes={userLikes}
            userPoints={userPoints}
            userId={userId}
            isFirst={isFirst}
            className="mt-auto"
          />
        </div>
      </div>
    </Card>
  );
};