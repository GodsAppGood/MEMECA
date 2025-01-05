interface MemeCardImageProps {
  imageUrl: string;
  title: string;
  position?: number;
  isFirst?: boolean;
  className?: string;
}

export const MemeCardImage = ({ imageUrl, title, position, isFirst, className }: MemeCardImageProps) => {
  return (
    <div className="relative">
      <img
        src={imageUrl}
        alt={title}
        className={`w-full object-cover transition-transform duration-300 hover:scale-105 ${className || ''}`}
      />
      {position && (
        <div className={`absolute top-2 left-2 ${
          isFirst ? 'bg-yellow-400' : 'bg-gray-800'
        } text-white px-3 py-1 rounded-full text-sm font-bold`}>
          #{position}
        </div>
      )}
    </div>
  );
};