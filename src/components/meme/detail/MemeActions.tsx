import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Meme } from "@/types/meme";

interface MemeActionsProps {
  meme: Meme;
  isAdmin: boolean;
  onUpdate: () => Promise<void>;
}

export const MemeActions = ({ meme, isAdmin, onUpdate }: MemeActionsProps) => {
  const { toast } = useToast();

  const handleTuzemoonToggle = async () => {
    try {
      const tuzemoonUntil = meme.is_featured 
        ? null 
        : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      const { error } = await supabase
        .from("Memes")
        .update({ 
          is_featured: !meme.is_featured,
          tuzemoon_until: tuzemoonUntil
        })
        .eq("id", meme.id);

      if (error) throw error;

      await onUpdate();
      toast({
        title: meme.is_featured ? "Removed from Tuzemoon" : "Added to Tuzemoon",
        description: meme.is_featured 
          ? "The meme has been removed from Tuzemoon" 
          : "The meme has been added to Tuzemoon for 24 hours",
      });
    } catch (error) {
      console.error("Error toggling Tuzemoon status:", error);
      toast({
        title: "Error",
        description: "Failed to update Tuzemoon status",
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) return null;

  return (
    <Button
      variant="outline"
      onClick={handleTuzemoonToggle}
      className={`group ${meme.is_featured ? 'text-yellow-500' : ''}`}
    >
      <Star className={`h-5 w-5 mr-2 ${meme.is_featured ? 'fill-current' : ''}`} />
      {meme.is_featured ? 'Remove from Tuzemoon' : 'Add to Tuzemoon'}
    </Button>
  );
};