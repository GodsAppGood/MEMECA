import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UnifiedMemeCard } from "../meme/UnifiedMemeCard";
import { useUserData } from "@/hooks/useUserData";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function UserMemes() {
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { userLikes } = useUserData(userId);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Session check in UserMemes:", session?.user?.id ?? "No session");
      setUserId(session?.user?.id ?? null);
    };
    getSession();
  }, []);

  const { data: memes = [], isLoading } = useQuery({
    queryKey: ["user-memes", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      console.log("Fetching memes for user:", userId);
      const { data, error } = await supabase
        .from('Memes')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching user memes:", error);
        throw error;
      }
      console.log("Fetched user memes:", data?.length ?? 0, "memes");
      return data || [];
    },
    enabled: !!userId
  });

  const EmptyState = () => (
    <div className="text-center space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          My memes is empty. Add some memes!
        </AlertDescription>
      </Alert>
      <Button 
        onClick={() => navigate('/submit')}
        className="bg-[#FFB74D] text-black hover:bg-[#FFB74D]/90 transition-all duration-300 hover:scale-105"
      >
        Create Meme
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-serif font-bold">My Memes</h2>
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!userId || memes.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-serif font-bold">My Memes</h2>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-serif font-bold">My Memes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memes.map((meme: any) => (
          <UnifiedMemeCard
            key={meme.id}
            meme={meme}
            userLikes={userLikes}
            userPoints={100}
            userId={userId}
          />
        ))}
      </div>
    </div>
  );
}