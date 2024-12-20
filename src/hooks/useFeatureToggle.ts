import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useFeatureToggle = (memeId: string, isFeatured: boolean) => {
  const queryClient = useQueryClient();

  const handleFeatureToggle = async () => {
    const id = parseInt(memeId);
    if (isNaN(id)) {
      throw new Error("Invalid meme ID");
    }

    const { error } = await supabase
      .from("Memes")
      .update({ is_featured: !isFeatured })
      .eq("id", id);

    if (error) {
      console.error("Error toggling feature status:", error);
      throw error;
    }

    // Invalidate relevant queries to trigger refetch
    await queryClient.invalidateQueries({ queryKey: ["memes"] });
    await queryClient.invalidateQueries({ queryKey: ["featured-memes"] });
  };

  return { handleFeatureToggle };
};