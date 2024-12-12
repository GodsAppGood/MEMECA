import { Meme } from "@/types/meme";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface MemeImageProps {
  meme: Meme;
}

export const MemeImage = ({ meme }: MemeImageProps) => {
  return (
    <div className="mb-6">
      <AspectRatio ratio={16 / 9} className="bg-muted">
        <img
          src={meme.image_url}
          alt={meme.title}
          className="rounded-lg object-cover w-full h-full"
        />
      </AspectRatio>
    </div>
  );
};