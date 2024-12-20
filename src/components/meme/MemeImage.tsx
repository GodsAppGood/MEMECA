interface MemeImageProps {
  imageUrl?: string;
  title: string;
  className?: string;
}

export const MemeImage = ({ imageUrl, title, className = '' }: MemeImageProps) => {
  if (!imageUrl) return null;

  return (
    <img
      src={imageUrl}
      alt={title}
      className={`w-full h-auto max-h-[600px] object-contain rounded-lg ${className}`}
    />
  );
};