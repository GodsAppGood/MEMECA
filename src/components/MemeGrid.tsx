import { useEffect } from "react";
import { UnifiedMemeCard } from "./meme/UnifiedMemeCard";
import { useUserData } from "@/hooks/useUserData";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { useMemeQuery } from "@/hooks/useMemeQuery";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { EmptyMemeState } from "./meme/EmptyMemeState";
import { useMemeAuth } from "@/hooks/useMemeAuth";
import { MemeGridLoader } from "./meme/grid/MemeGridLoader";
import { MemeGridError } from "./meme/grid/MemeGridError";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { MemePagination } from "./MemePagination";

interface MemeGridProps {
  selectedDate?: Date;
  selectedBlockchain?: string;
  showTodayOnly?: boolean;
  showTopOnly?: boolean;
  currentPage?: number;
  itemsPerPage?: number;
  userOnly?: boolean;
  onPageChange?: (page: number) => void;
}

export const MemeGrid = ({ 
  selectedDate, 
  selectedBlockchain, 
  showTodayOnly,
  showTopOnly,
  currentPage = 1,
  itemsPerPage = 20,
  userOnly = false,
  onPageChange
}: MemeGridProps) => {
  const navigate = useNavigate();
  const { userId } = useMemeAuth();
  const { userPoints, userLikes, refetchLikes } = useUserData(userId);
  
  const { data: memes = [], isLoading, error, refetch } = useMemeQuery({
    selectedDate,
    selectedBlockchain,
    showTodayOnly,
    showTopOnly,
    currentPage,
    itemsPerPage,
    userOnly,
    userId: userOnly ? userId : null
  });

  useEffect(() => {
    if (error) {
      console.error("Error in MemeGrid:", error);
    }
  }, [error]);

  useRealtimeSubscription(
    [
      { name: 'Memes' },
      { name: 'Watchlist' }
    ],
    () => {
      console.log("Realtime update received, refetching data...");
      void refetch();
      void refetchLikes();
    }
  );

  if (userOnly && !userId) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You need to log in to view your memes.
          </AlertDescription>
        </Alert>
        <Button 
          onClick={() => navigate('/')} 
          variant="default"
          className="bg-[#FFB74D] text-black hover:bg-[#FFB74D]/90"
        >
          Go to Home Page
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <MemeGridLoader />;
  }

  if (error) {
    console.error("MemeGrid error:", error);
    return <MemeGridError error={error} />;
  }

  // Фильтруем удаленные мемы, если пользователь не админ
  const filteredMemes = memes.filter(meme => {
    if (!meme.is_deleted) return true;
    if (userId && meme.created_by === userId) return true;
    return false;
  });

  if (!filteredMemes || filteredMemes.length === 0) {
    return <EmptyMemeState isUserOnly={userOnly} />;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMemes.map((meme: any) => (
          <UnifiedMemeCard
            key={meme.id}
            meme={meme}
            userLikes={userLikes}
            userPoints={userPoints}
            userId={userId}
          />
        ))}
      </div>
      {onPageChange && (
        <MemePagination 
          currentPage={currentPage} 
          setCurrentPage={onPageChange}
        />
      )}
    </div>
  );
};