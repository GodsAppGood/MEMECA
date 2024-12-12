import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { MemeCardActions } from "./MemeCardActions";
import { MemeCardImage } from "./MemeCardImage";

interface MemeCardProps {
  meme: {
    id: string;
    title: string;
    description: string;
    image_url: string;
    created_at: string;
    likes: number;
    created_by: string;
  };
  userLikes: string[];
  userPoints: number;
  userId: string | null;
}

export const MemeCard = ({ meme, userLikes, userPoints, userId }: MemeCardProps) => {
  const navigate = useNavigate();

  const handleMemeClick = () => {
    navigate(`/meme/${meme.id}`);
  };

  return (
    <Card className="overflow-hidden transition-transform duration-300 hover:scale-105">
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