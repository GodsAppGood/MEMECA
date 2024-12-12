import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MemeCard } from "./meme/MemeCard";
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
  
  const { data: memes = [], isLoading, refetch } = useMemeQuery({
    selectedDate,
    selectedBlockchain,
    showTodayOnly,
    showTopOnly,
    currentPage,
    itemsPerPage,
    userOnly,
    userId
  });

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