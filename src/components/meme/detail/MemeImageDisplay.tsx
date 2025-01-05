import { AspectRatio } from "@/components/ui/aspect-ratio";

interface MemeImageDisplayProps {
  imageUrl?: string | null;
  title: string;
}

export const MemeImageDisplay = ({ imageUrl, title }: MemeImageDisplayProps) => {
  if (!imageUrl) {
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
          src={imageUrl}
          alt={title}
          className="rounded-lg object-cover w-full h-full"
        />
      </AspectRatio>
    </div>
  );
};