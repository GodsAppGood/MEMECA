import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UnifiedMemeCard } from "../meme/UnifiedMemeCard";
import { useUserData } from "@/hooks/useUserData";

export function UserMemes() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id ?? null);
    };
    getSession();
  }, []);

  const { userPoints, userLikes } = useUserData(userId);

  const { data: memes = [], isLoading } = useQuery({
    queryKey: ["user-memes", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('Memes')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId
  });

  if (isLoading) {
    return <div>Loading...</div>;
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
            userPoints={userPoints}
            userId={userId}
          />
        ))}
      </div>
    </div>
  );
}