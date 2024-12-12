import { Meme } from "@/types/meme";

interface MemeHeaderProps {
  meme: Meme;
}

export const MemeHeader = ({ meme }: MemeHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-2">{meme.title}</h1>
      {meme.description && (
        <p className="text-gray-600 dark:text-gray-400">{meme.description}</p>
      )}
    </div>
  );
};