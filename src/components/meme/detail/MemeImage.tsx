import { Meme } from "@/types/meme";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface MemeImageProps {
  meme: Meme;
  className?: string;
}

export const MemeImage = ({ meme, className = '' }: MemeImageProps) => {
  return (
    <div className="mb-6">
      <AspectRatio ratio={16 / 9} className="bg-muted">
        <img
          src={meme.image_url}
          alt={meme.title}
          className={`rounded-lg object-cover w-full h-full ${className}`}
        />
      </AspectRatio>
    </div>
  );
};