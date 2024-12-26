import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { UnifiedMemeCard } from "../meme/UnifiedMemeCard";
import { useUserData } from "@/hooks/useUserData";
import { useWatchlistSubscription } from "@/hooks/useWatchlistSubscription";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { LoadingSpinner } from "../LoadingSpinner";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export function Watchlist() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUserId(session?.user?.id ?? null);
        setIsAuthenticated(!!session);
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user?.id ?? null);
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const { userPoints, userLikes } = useUserData(userId);

  const { data: watchlistMemes = [], isLoading, error, refetch } = useQuery({
    queryKey: ["watchlist-memes", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      try {
        const { data: watchlistData, error: watchlistError } = await supabase
          .from('Watchlist')
          .select('meme_id, Memes(*)')
          .eq('user_id', userId);
        
        if (watchlistError) {
          console.error("Error fetching watchlist:", watchlistError);
          throw new Error("Failed to fetch watchlist");
        }
        
        if (!watchlistData) return [];
        
        const memes = watchlistData.map(item => item.Memes);
        return memes || [];
      } catch (error: any) {
        console.error("Unexpected error:", error);
        throw error;
      }
    },
    enabled: !!userId
  });

  useWatchlistSubscription(() => {
    console.log("Watchlist updated, refetching...");
    void refetch();
  });

  if (!isAuthenticated) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex flex-col gap-4">
          <p>Please log in to view your watchlist.</p>
          <Button 
            onClick={() => navigate("/")}
            variant="outline"
            className="w-fit"
          >
            Go to Home
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load watchlist. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="flex-1 container mx-auto px-4 py-8">
        <h2 className="text-3xl font-serif font-bold mb-8">My Watchlist</h2>
        
        {watchlistMemes.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your watchlist is empty. Add some memes!
            </AlertDescription>
          </Alert>
        ) : (
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