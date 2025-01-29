import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { UnifiedMemeCard } from "../meme/UnifiedMemeCard";
import { useUserData } from "@/hooks/useUserData";
import { useToast } from "@/hooks/use-toast";

export function Watchlist() {
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUserId(session?.user?.id ?? null);
      } catch (error) {
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

  const { data: watchlistMemes = [], isLoading, error } = useQuery({
    queryKey: ["watchlist-memes", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data: watchlistData, error: watchlistError } = await supabase
        .from('Watchlist')
        .select(`
          meme_id,
          Memes (*)
        `)
        .eq('user_id', userId);
      
      if (watchlistError) throw watchlistError;
      
      return watchlistData
        .filter(item => item.Memes)
        .map(item => ({
          ...item.Memes,
          id: item.Memes.id.toString()
        }));
    },
    enabled: !!userId,
    refetchInterval: 5000 // Обновляем каждые 5 секунд
  });

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="flex-1 container mx-auto px-4 py-8">
        <h2 className="text-3xl font-serif font-bold mb-8">My Watchlist</h2>
        
        {isLoading && (
          <div className="flex justify-center items-center h-32">
            <p>Loading...</p>
          </div>
        )}

        {error && (
          <div className="text-center p-4">
            <p className="text-red-500">Failed to load watchlist</p>
          </div>
        )}

        {!isLoading && !error && watchlistMemes.length === 0 && (
          <div className="flex justify-center items-center h-32">
            <p className="text-muted-foreground">Your watchlist is empty. Add some memes!</p>
          </div>
        )}

        {watchlistMemes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
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
    </div>
  );
}