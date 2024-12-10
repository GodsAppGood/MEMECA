import { useQuery } from "@tanstack/react-query";
import { MemeCard } from "./meme/MemeCard";

interface MemeGridProps {
  selectedDate?: Date;
  selectedBlockchain?: string;
  showTodayOnly?: boolean;
  showTopOnly?: boolean;
  currentPage?: number;
  itemsPerPage?: number;
}

export const MemeGrid = ({ 
  selectedDate, 
  selectedBlockchain, 
  showTodayOnly,
  showTopOnly,
  currentPage = 1,
  itemsPerPage = 100
}: MemeGridProps) => {
  const userId = "current-user-id"; // This should be replaced with actual user ID

  const { data: userPoints = 0 } = useQuery({
    queryKey: ["user-points", userId],
    queryFn: () => {
      return parseInt(localStorage.getItem(`points-${userId}`) || "100");
    }
  });

  const { data: userLikes = [] } = useQuery({
    queryKey: ["user-likes", userId],
    queryFn: () => {
      return JSON.parse(localStorage.getItem(`likes-${userId}`) || "[]");
    }
  });

  const { data: memes = [], isLoading } = useQuery({
    queryKey: ["memes", selectedDate, selectedBlockchain, showTodayOnly, showTopOnly, currentPage],
    queryFn: () => {
      let storedMemes = JSON.parse(localStorage.getItem("memes") || "[]");
      
      if (showTodayOnly) {
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        storedMemes = storedMemes.filter((meme: any) => 
          new Date(meme.dateAdded) > last24Hours
        );
      }

      if (selectedDate) {
        storedMemes = storedMemes.filter((meme: any) => 
          new Date(meme.dateAdded).toDateString() === selectedDate.toDateString()
        );
      }

      if (selectedBlockchain) {
        storedMemes = storedMemes.filter((meme: any) => 
          meme.blockchain.toLowerCase() === selectedBlockchain.toLowerCase()
        );
      }

      storedMemes = storedMemes.sort((a: any, b: any) => 
        new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      );

      if (showTopOnly) {
        storedMemes = storedMemes.sort((a: any, b: any) => b.likes - a.likes).slice(0, 200);
      }

      // Apply pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return storedMemes.slice(startIndex, endIndex);
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {memes.map((meme: any) => (
        <MemeCard
          key={meme.id}
          meme={meme}
          userLikes={userLikes}
          userPoints={userPoints}
          userId={userId}
        />
      ))}
    </div>
  );
};