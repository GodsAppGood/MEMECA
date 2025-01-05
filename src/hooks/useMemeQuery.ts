import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, endOfDay } from "date-fns";

interface MemeQueryOptions {
  selectedDate?: Date;
  selectedBlockchain?: string;
  showTodayOnly?: boolean;
  showTopOnly?: boolean;
  currentPage: number;
  itemsPerPage: number;
  userOnly: boolean;
  userId: string | null;
}

export const useMemeQuery = ({
  selectedDate,
  selectedBlockchain,
  showTodayOnly,
  showTopOnly,
  currentPage,
  itemsPerPage,
  userOnly,
  userId
}: MemeQueryOptions) => {
  console.log("Initializing useMemeQuery with options:", {
    selectedDate,
    selectedBlockchain,
    showTodayOnly,
    showTopOnly,
    currentPage,
    itemsPerPage,
    userOnly,
    userId
  });

  return useQuery({
    queryKey: ["memes", selectedDate?.toISOString(), selectedBlockchain, showTodayOnly, showTopOnly, currentPage, userOnly, userId],
    queryFn: async () => {
      console.log("Executing meme query function");
      let query = supabase
        .from('Memes')
        .select('*');

      if (userOnly && userId) {
        console.log("Filtering by user ID:", userId);
        query = query.eq('created_by', userId);
      }

      if (selectedDate) {
        const start = startOfDay(selectedDate);
        const end = endOfDay(selectedDate);
        query = query.gte('created_at', start.toISOString())
                    .lte('created_at', end.toISOString());
      }

      if (selectedBlockchain) {
        query = query.eq('blockchain', selectedBlockchain);
      }

      if (showTodayOnly) {
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        query = query.gte('created_at', last24Hours);
      }

      // Always order by likes in descending order for consistent ranking
      query = query.order('likes', { ascending: false });

      if (!showTopOnly) {
        // If not showing top memes, add a secondary sort by creation date
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);
      
      if (error) {
        console.error("Error fetching memes:", error);
        throw error;
      }

      console.log("Fetched memes:", data?.length ?? 0, "memes");
      return data || [];
    },
    staleTime: 30000,
    enabled: true
  });
};