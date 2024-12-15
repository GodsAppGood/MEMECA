import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { MemeCardActions } from "./MemeCardActions";
import { MemeCardImage } from "./MemeCardImage";
import { useState, useEffect } from "react";

interface MemeCardProps {
  meme: {
    id: string;
    title: string;
    description: string;
    image_url: string;
    created_at: string;
    likes: number;
    created_by: string;
    time_until_listing?: string;
  };
  userLikes: string[];
  userPoints: number;
  userId: string | null;
}

export const MemeCard = ({ meme, userLikes, userPoints, userId }: MemeCardProps) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    if (!meme.time_until_listing) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const listingTime = new Date(meme.time_until_listing).getTime();
      const distance = listingTime - now;

      if (distance < 0) {
        setTimeLeft(null);
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [meme.time_until_listing]);

  const handleMemeClick = () => {
    navigate(`/meme/${meme.id}`);
  };

  return (
    <Card className="overflow-hidden transition-transform duration-300 hover:scale-105 relative">
      {timeLeft && (
        <div className="absolute top-2 left-2 z-10 bg-black/70 text-white px-2 py-1 rounded text-sm">
          {timeLeft}
        </div>
      )}
      <div 
        className="cursor-pointer" 
        onClick={handleMemeClick}
      >
        <MemeCardImage
          imageUrl={meme.image_url}
          title={meme.title}
        />
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">{meme.title}</h3>
            <MemeCardActions
              meme={meme}
              userLikes={userLikes}
              userPoints={userPoints}
              userId={userId}
            />
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {meme.description}
          </p>
          <span className="text-sm text-muted-foreground">
            {new Date(meme.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Card>
  );
};