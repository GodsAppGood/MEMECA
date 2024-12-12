import { useQuery } from "@tanstack/react-query";
import { MemeCard } from "./meme/MemeCard";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id ?? null);
    };
    getSession();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('memes_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Memes' },
        () => {
          // Invalidate and refetch queries when data changes
          void refetch();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const { data: userPoints = 0 } = useQuery({
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

  const { data: userLikes = [] } = useQuery({
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

  const { data: memes = [], isLoading, refetch } = useQuery({
    queryKey: ["memes", selectedDate, selectedBlockchain, showTodayOnly, showTopOnly, currentPage, userOnly, userId],
    queryFn: async () => {
      let query = supabase
        .from('Memes')
        .select('*');
      
      if (userOnly && userId) {
        query = query.eq('created_by', userId);
      }

      if (showTodayOnly) {
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        query = query.gte('created_at', last24Hours);
      }

      if (selectedDate) {
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);
        query = query
          .gte('created_at', startOfDay.toISOString())
          .lte('created_at', endOfDay.toISOString());
      }

      if (selectedBlockchain) {
        query = query.eq('blockchain', selectedBlockchain);
      }

      if (showTopOnly) {
        query = query.order('likes', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {memes.map((meme: any) => (
        <MemeCard
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