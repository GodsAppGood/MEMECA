
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Heart, Rocket } from "lucide-react";
import { useMemeStatsSubscription } from "@/hooks/useMemeStatsSubscription";

interface MemeStatsProps {
  memeId: number;
}

export const MemeStats = ({ memeId }: MemeStatsProps) => {
  // Add subscription to real-time updates
  useMemeStatsSubscription(memeId);

  const { data: stats = { watchlistCount: 0, likesCount: 0, tuzemoonCount: 0 }, isLoading } = useQuery({
    queryKey: ["meme-stats", memeId],
    queryFn: async () => {
      // Get watchlist count
      const { count: watchlistCount, error: watchlistError } = await supabase
        .from('Watchlist')
        .select('*', { count: 'exact', head: true })
        .eq('meme_id', memeId);

      if (watchlistError) throw watchlistError;

      // Get likes count
      const { count: likesCount, error: likesError } = await supabase
        .from('Likes')
        .select('*', { count: 'exact', head: true })
        .eq('meme_id', memeId);

      if (likesError) throw likesError;

      // Get tuzemoon count
      const { count: tuzemoonCount, error: tuzemoonError } = await supabase
        .from('TuzemoonPayments')
        .select('*', { count: 'exact', head: true })
        .eq('meme_id', memeId)
        .eq('transaction_status', 'success');

      if (tuzemoonError) throw tuzemoonError;

      return {
        watchlistCount: watchlistCount || 0,
        likesCount: likesCount || 0,
        tuzemoonCount: tuzemoonCount || 0
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-24 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <Card className="border-2 border-[#FFB74D]">
      <CardContent className="p-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Eye className="h-4 w-4" />
              <span className="text-sm">Watchlist</span>
            </div>
            <span className="text-2xl font-bold">{stats.watchlistCount}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Heart className="h-4 w-4" />
              <span className="text-sm">Likes</span>
            </div>
            <span className="text-2xl font-bold">{stats.likesCount}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Rocket className="h-4 w-4" />
              <span className="text-sm">Tuzemoon</span>
            </div>
            <span className="text-2xl font-bold">{stats.tuzemoonCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
