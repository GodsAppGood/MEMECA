import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUserData = (userId: string | null) => {
  const { data: userPoints = 0, refetch: refetchPoints } = useQuery({
    queryKey: ["user-points", userId],
    queryFn: async () => {
      if (!userId) return 100;
      const { data, error } = await supabase
        .from('Users')
        .select('referral_points')
        .eq('auth_id', userId)
        .single();
      
      if (error) throw error;
      return data?.referral_points || 100;
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
    refetchPoints,
    refetchLikes
  };
};