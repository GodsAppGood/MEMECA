import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useFeatureToggle = (memeId: string, isFeatured: boolean) => {
  const { toast } = useToast();

  const handleFeatureToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const id = parseInt(memeId);
    if (isNaN(id)) {
      console.error("Invalid meme ID:", memeId);
      toast({
        title: "Error",
        description: "Invalid meme ID",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("Memes")
        .update({ is_featured: !isFeatured })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: isFeatured 
          ? "Meme removed from featured" 
          : "Meme added to featured",
      });
    } catch (error) {
      console.error("Error toggling feature status:", error);
      toast({
        title: "Error",
        description: "Failed to update feature status",
        variant: "destructive",
      });
    }
  };

  return { handleFeatureToggle };
};