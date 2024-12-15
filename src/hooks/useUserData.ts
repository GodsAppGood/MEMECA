import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUserData = (userId: string | null) => {
  const { data: userPoints = 100 } = useQuery({
    queryKey: ["user-points", userId],
    queryFn: async () => {
      return 100; // Default points since referral system is removed
    }
  });

  const { data: userLikes = [], refetch: refetchLikes } = useQuery({
    queryKey: ["user-likes", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('Watchlist')
        .select('meme_id')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data?.map(item => item.meme_id.toString()) ?? [];
    }
  });

  return {
    userPoints,
    userLikes,
    refetchLikes
  };
};