import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const updateTuzemoonStatus = async (memeId: string, isFeatured: boolean) => {
  const tuzemoonUntil = isFeatured 
    ? null 
    : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  try {
    const { error } = await supabase
      .from("Memes")
      .update({ 
        is_featured: !isFeatured,
        tuzemoon_until: tuzemoonUntil
      })
      .eq("id", parseInt(memeId));

    if (error) throw error;
    
    toast({
      title: isFeatured ? "Removed from Tuzemoon" : "Added to Tuzemoon",
      description: isFeatured 
        ? "The meme has been removed from Tuzemoon" 
        : "The meme has been added to Tuzemoon for 24 hours",
    });

    return true;
  } catch (error) {
    console.error("Error updating Tuzemoon status:", error);
    toast({
      title: "Error",
      description: "Failed to update Tuzemoon status",
      variant: "destructive",
    });
    return false;
  }
};