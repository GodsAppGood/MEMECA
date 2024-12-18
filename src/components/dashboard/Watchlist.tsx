import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { UnifiedMemeCard } from "../meme/UnifiedMemeCard";
import { useUserData } from "@/hooks/useUserData";
import { useWatchlistSubscription } from "@/hooks/useWatchlistSubscription";
import { useToast } from "@/components/ui/use-toast";

export function Watchlist() {
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUserId(session?.user?.id ?? null);
      } catch (error: any) {
        console.error("Session error:", error);
        toast({
          title: "Authentication Error",
          description: "Please try logging in again",
          variant: "destructive",
        });
      }
    };
    void getSession();
  }, [toast]);

  const { userPoints, userLikes } = useUserData(userId);

  const { data: watchlistMemes = [], isLoading, refetch } = useQuery({
    queryKey: ["watchlist-memes", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      try {
        // First, get all watchlist entries for the current user
        const { data: watchlistData, error: watchlistError } = await supabase
          .from('Watchlist')
          .select('meme_id')
          .eq('user_id', userId);
        
        if (watchlistError) {
          console.error("Error fetching watchlist:", watchlistError);
          toast({
            title: "Error",
            description: "Failed to fetch watchlist",
            variant: "destructive",
          });
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
          toast({
            title: "Error",
            description: "Failed to fetch memes",
            variant: "destructive",
          });
          return [];
        }
        
        return memesData || [];
      } catch (error: any) {
        console.error("Unexpected error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: !!userId,
    retry: 3, // Add retry logic
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
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