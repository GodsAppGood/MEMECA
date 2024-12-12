import { Trophy } from "lucide-react";

interface MemeCardImageProps {
  imageUrl: string;
  title: string;
  position: number;
  isFirst: boolean;
}

export const MemeCardImage = ({ 
  imageUrl, 
  title, 
  position, 
  isFirst 
}: MemeCardImageProps) => {
  return (
    <div className="relative">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-48 object-cover"
      />
      {isFirst && (
        <div className="absolute top-2 right-2">
          <Trophy className="h-6 w-6 text-yellow-400" />
        </div>
      )}
      <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded">
        #{position}
      </div>
    </div>
  );
};