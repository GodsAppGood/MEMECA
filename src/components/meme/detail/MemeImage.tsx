import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Meme } from "@/types/meme";

interface MemeImageProps {
  meme: Meme;
  className?: string;
}

export const MemeImage = ({ meme, className = '' }: MemeImageProps) => {
  if (!meme?.image_url) {
    return (
      <div className="mb-6">
        <AspectRatio ratio={16 / 9} className="bg-muted">
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No image available
          </div>
        </AspectRatio>
      </div>
    );
  }

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