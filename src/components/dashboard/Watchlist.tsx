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

  const { data: watchlistMemes = [], isLoading, refetch } = useQuery({
    queryKey: ["watchlist-memes", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      // First, get all watchlist entries for the current user
      const { data: watchlistData, error: watchlistError } = await supabase
        .from('Watchlist')
        .select('meme_id')
        .eq('user_id', userId);
      
      if (watchlistError) {
        console.error("Error fetching watchlist:", watchlistError);
        return [];
      }
      
      const memeIds = watchlistData?.map(item => item.meme_id) || [];
      
      if (memeIds.length === 0) return [];
      
      // Then fetch all corresponding memes
      const { data: memesData, error: memesError } = await supabase
        .from('Memes')
        .select('*')
        .in('id', memeIds);
      
      if (memesError) {
        console.error("Error fetching memes:", memesError);
        return [];
      }
      
      return memesData || [];
    },
    enabled: !!userId
  });

  // Add real-time subscription
  useWatchlistSubscription(() => {
    console.log("Watchlist updated, refetching...");
    void refetch();
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-serif font-bold">My Watchlist</h2>
      {watchlistMemes.length === 0 ? (
        <p className="text-muted-foreground">Your watchlist is empty. Add some memes!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlistMemes.map((meme: any) => (
            <UnifiedMemeCard
              key={meme.id}
              meme={meme}
              userLikes={userLikes}
              userPoints={userPoints}
              userId={userId}
            />
          ))}
        </div>
      )}
    </div>
  );
}