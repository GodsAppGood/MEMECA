import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { UnifiedMemeCard } from "../meme/UnifiedMemeCard";
import { useUserData } from "@/hooks/useUserData";
import { useWatchlistSubscription } from "@/hooks/useWatchlistSubscription";

export function Watchlist() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id ?? null);
    };
    getSession();
  }, []);

  const { userPoints, userLikes } = useUserData(userId);

  const { data: likedMemes = [], isLoading, refetch } = useQuery({
    queryKey: ["watchlist-memes", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data: watchlistData, error: watchlistError } = await supabase
        .from('Watchlist')
        .select('meme_id')
        .eq('user_id', userId);
      
      if (watchlistError) throw watchlistError;
      
      const memeIds = watchlistData.map(item => item.meme_id);
      
      if (memeIds.length === 0) return [];
      
      const { data: memesData, error: memesError } = await supabase
        .from('Memes')
        .select('*')
        .in('id', memeIds);
      
      if (memesError) throw memesError;
      return memesData || [];
    },
    enabled: !!userId
  });

  // Add real-time subscription
  useWatchlistSubscription(() => {
    void refetch();
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-serif font-bold">My Watchlist</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {likedMemes.map((meme: any) => (
          <UnifiedMemeCard
            key={meme.id}
            meme={meme}
            userLikes={userLikes}
            userPoints={userPoints}
            userId={userId}
          />
        ))}
      </div>
    </div>
  );
}