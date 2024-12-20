import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  return useQuery({
    queryKey: ["memes", selectedDate, selectedBlockchain, showTodayOnly, showTopOnly, currentPage, userOnly, userId],
    queryFn: async () => {
      console.log("Fetching memes with params:", {
        selectedDate,
        selectedBlockchain,
        showTodayOnly,
        showTopOnly,
        currentPage,
        itemsPerPage,
        userOnly,
        userId
      });

      let query = supabase
        .from('Memes')
        .select('*');

      // Handle time_until_listing filter differently based on user authentication
      const currentTime = new Date().toISOString();
      console.log("Current time:", currentTime);

      if (!userOnly) {
        if (userId) {
          // For logged-in users: show their memes plus listed memes from others
          query = query.or(`time_until_listing.lte.${currentTime},created_by.eq.${userId}`);
        } else {
          // For non-logged-in users: only show listed memes
          query = query.lte('time_until_listing', currentTime);
        }
      }
      
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
      
      if (error) {
        console.error("Error fetching memes:", error);
        throw error;
      }

      console.log("Fetched memes:", data);
      return data;
    }
  });
};