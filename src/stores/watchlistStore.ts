import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";

interface WatchlistState {
  watchlist: Set<string>;
  isLoading: boolean;
  toggleWatchlist: (memeId: string, userId: string | null) => Promise<void>;
  isInWatchlist: (memeId: string) => boolean;
  initializeWatchlist: (userId: string) => Promise<void>;
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  watchlist: new Set<string>(),
  isLoading: false,

  toggleWatchlist: async (memeId: string, userId: string | null) => {
    if (!userId) {
      console.error("No user ID provided for watchlist toggle");
      return;
    }

    set({ isLoading: true });
    const currentWatchlist = new Set(get().watchlist);
    const isCurrentlyInWatchlist = currentWatchlist.has(memeId);

    try {
      if (isCurrentlyInWatchlist) {
        const { error: deleteError } = await supabase
          .from("Watchlist")
          .delete()
          .eq("user_id", userId)
          .eq("meme_id", parseInt(memeId));

        if (deleteError) throw deleteError;
        currentWatchlist.delete(memeId);
      } else {
        const { error: insertError } = await supabase
          .from("Watchlist")
          .insert([{ 
            user_id: userId, 
            meme_id: parseInt(memeId) 
          }]);

        if (insertError) {
          if (insertError.code === '23505') {
            console.log("Meme already in watchlist");
            return;
          }
          throw insertError;
        }
        currentWatchlist.add(memeId);
      }

      set({ watchlist: currentWatchlist });
    } catch (error) {
      console.error("Error toggling watchlist:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  isInWatchlist: (memeId: string) => {
    return get().watchlist.has(memeId);
  },

  initializeWatchlist: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("Watchlist")
        .select("meme_id")
        .eq("user_id", userId);

      if (error) throw error;

      const watchlistIds = new Set(data.map(item => item.meme_id.toString()));
      set({ watchlist: watchlistIds });
    } catch (error) {
      console.error("Error initializing watchlist:", error);
      throw error;
    }
  },
}));

export const subscribeToWatchlistChanges = (userId: string) => {
  console.log("Setting up watchlist subscription for user:", userId);
  
  const channel = supabase
    .channel(`watchlist_changes_${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "Watchlist",
        filter: `user_id=eq.${userId}`,
      },
      async (payload) => {
        console.log("Watchlist change detected:", payload);
        try {
          await useWatchlistStore.getState().initializeWatchlist(userId);
        } catch (error) {
          console.error("Error handling watchlist change:", error);
        }
      }
    )
    .subscribe();

  return () => {
    console.log("Cleaning up watchlist subscription");
    void supabase.removeChannel(channel);
  };
};