import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Meme } from "@/types/meme";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

interface TuzemoonButtonProps {
  meme: Meme;
  isAdmin: boolean;
  onUpdate: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<any, Error>>;
}

export const TuzemoonButton = ({ meme, isAdmin, onUpdate }: TuzemoonButtonProps) => {
  const { toast } = useToast();

  const addToTuzemoon = async () => {
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

      void onUpdate();
      
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
      onClick={addToTuzemoon}
      className={`group ${meme.is_featured ? 'bg-orange-50' : ''}`}
    >
      <Flame className={`h-5 w-5 mr-2 ${meme.is_featured ? 'fill-orange-500 text-orange-500' : ''}`} />
      {meme.is_featured ? 'Remove from Tuzemoon' : 'Add to Tuzemoon'}
    </Button>
  );
};