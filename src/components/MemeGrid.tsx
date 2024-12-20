import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UnifiedMemeCard } from "./meme/UnifiedMemeCard";
import { useUserData } from "@/hooks/useUserData";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { useMemeQuery } from "@/hooks/useMemeQuery";

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
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id ?? null);
    };
    getSession();
  }, []);

  const { userPoints, userLikes, refetchLikes } = useUserData(userId);
  
  const { data: memes = [], isLoading, error } = useMemeQuery({
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

  useEffect(() => {
    console.log("MemeGrid rendered with props:", {
      selectedDate,
      selectedBlockchain,
      showTodayOnly,
      showTopOnly,
      currentPage,
      itemsPerPage,
      userOnly,
      userId,
      memesCount: memes?.length
    });
  }, [selectedDate, selectedBlockchain, showTodayOnly, showTopOnly, currentPage, itemsPerPage, userOnly, userId, memes]);

  useRealtimeSubscription(
    [
      { name: 'Memes' },
      { name: 'Watchlist' }
    ],
    () => {
      void refetchLikes();
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading memes. Please try again later.</div>;
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