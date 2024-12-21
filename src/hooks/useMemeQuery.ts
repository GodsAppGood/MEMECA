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

      // For the main feed, show all memes that have passed their listing time
      const currentTime = new Date().toISOString();
      console.log("Current time:", currentTime);
      
      if (userOnly && userId) {
        // If viewing user's own memes, show all their memes
        query = query.eq('created_by', userId);
      } else {
        // For the main feed, show all memes that have passed their listing time
        query = query.or(`time_until_listing.is.null,time_until_listing.lte.${currentTime}`);
      }

      // Apply date filter if selected
      if (selectedDate) {
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        query = query.or(
          `and(created_at.gte.${startOfDay.toISOString()},created_at.lte.${endOfDay.toISOString()})`
        );
      }

      // Apply blockchain filter if selected
      if (selectedBlockchain) {
        query = query.eq('blockchain', selectedBlockchain);
      }

      if (showTodayOnly) {
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        query = query.gte('created_at', last24Hours);
      }

      // Apply sorting
      if (showTopOnly) {
        query = query.order('likes', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
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