import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UnifiedMemeCard } from "./meme/UnifiedMemeCard";
import { useUserData } from "@/hooks/useUserData";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { useMemeQuery } from "@/hooks/useMemeQuery";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id ?? null);
      setIsAuthenticated(!!session);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user?.id ?? null);
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  if (userOnly && !isAuthenticated) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex flex-col gap-4">
          <p>Please log in to view your memes.</p>
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
          Error loading memes. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (memes.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {userOnly ? "You haven't created any memes yet." : "No memes found."}
        </AlertDescription>
      </Alert>
    );
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