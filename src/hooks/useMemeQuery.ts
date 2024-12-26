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

      // If we're in userOnly mode and there's no userId, return empty array
      if (userOnly && !userId) {
        return [];
      }

      let query = supabase
        .from('Memes')
        .select('*');

      // For user's own memes, show all their memes
      if (userOnly && userId) {
        query = query.eq('created_by', userId);
      }

      // Apply date filter only if explicitly selected
      if (selectedDate) {
        const start = startOfDay(selectedDate);
        const end = endOfDay(selectedDate);
        query = query.gte('created_at', start.toISOString())
                    .lte('created_at', end.toISOString());
      }

      // Apply blockchain filter only if explicitly selected
      if (selectedBlockchain) {
        query = query.eq('blockchain', selectedBlockchain);
      }

      // Apply 24-hour filter only if explicitly requested
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
      return data || [];
    },
    enabled: !userOnly || (userOnly && !!userId) // Only enable the query for userOnly mode if we have a userId
  });
};