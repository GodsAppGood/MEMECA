import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UnifiedMemeCard } from "../meme/UnifiedMemeCard";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Tuzemoon() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id ?? null);
    };
    getSession();
  }, []);

  const { data: userLikes = [] } = useQuery({
    queryKey: ["user-likes", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("Watchlist")
        .select("meme_id")
        .eq("user_id", userId);
      
      if (error) throw error;
      return data?.map(item => item.meme_id.toString()) ?? [];
    },
    enabled: !!userId
  });

  const { data: userPoints = 100 } = useQuery({
    queryKey: ["user-points", userId],
    queryFn: async () => {
      return 100; // Placeholder for points system
    }
  });

  const { data: featuredMemes = [], isLoading } = useQuery({
    queryKey: ["featured-memes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Memes")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data?.map(meme => ({
        ...meme,
        id: meme.id.toString()
      })) ?? [];
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-serif font-bold">Tuzemoon</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="h-48 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (featuredMemes.length === 0) {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-serif font-bold">Tuzemoon</h2>
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">No Featured Memes Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-600">
              Stay tuned! Featured memes will appear here soon.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-serif font-bold">Tuzemoon</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredMemes.map((meme) => (
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