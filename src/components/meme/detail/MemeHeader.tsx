import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Meme } from "@/types/meme";

interface MemeHeaderProps {
  meme: Meme;
}

export const MemeHeader = ({ meme }: MemeHeaderProps) => {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-serif">{meme.title}</h1>
      {meme.is_featured && (
        <Badge 
          className="bg-yellow-500 text-white animate-pulse"
          variant="secondary"
        >
          <Star className="w-4 h-4 mr-1" />
          Tuzemoon
        </Badge>
      )}
    </div>
  );
};