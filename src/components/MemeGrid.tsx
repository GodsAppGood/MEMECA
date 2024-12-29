import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UnifiedMemeCard } from "./meme/UnifiedMemeCard";
import { useUserData } from "@/hooks/useUserData";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { useMemeQuery } from "@/hooks/useMemeQuery";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { EmptyMemeState } from "./meme/EmptyMemeState";
import { useMemeAuth } from "@/hooks/useMemeAuth";

interface MemeGridProps {
  selectedDate?: Date;
  selectedBlockchain?: string;
  showTodayOnly?: boolean;
  showTopOnly?: boolean;
  currentPage?: number;
  itemsPerPage?: number;
  userOnly?: boolean;
}

export const MemeGrid = ({ 
  selectedDate, 
  selectedBlockchain, 
  showTodayOnly,
  showTopOnly,
  currentPage = 1,
  itemsPerPage = 100,
  userOnly = false
}: MemeGridProps) => {
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
    userId
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
      void refetch();
      void refetchLikes();
    }
  );

  if (userOnly && !userId) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You need to log in to view your memes.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading memes. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!memes || memes.length === 0) {
    return <EmptyMemeState isUserOnly={userOnly} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {memes.map((meme: any) => (
        <UnifiedMemeCard
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