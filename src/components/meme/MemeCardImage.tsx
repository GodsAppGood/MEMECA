interface MemeCardImageProps {
  imageUrl: string;
  title: string;
  position?: number;
  isFirst?: boolean;
}

export const MemeCardImage = ({ imageUrl, title, position, isFirst }: MemeCardImageProps) => {
  return (
    <div className="relative">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
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