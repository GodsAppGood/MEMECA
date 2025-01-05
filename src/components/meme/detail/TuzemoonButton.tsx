import { Button } from "@/components/ui/button";
import { Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TuzemoonButtonProps {
  memeId: string;
  isFeatured: boolean;
  isAdmin: boolean;
  isVerified: boolean;
  onUpdate: () => Promise<any>;
}

export const TuzemoonButton = ({ 
  memeId, 
  isFeatured, 
  isAdmin, 
  isVerified,
  onUpdate 
}: TuzemoonButtonProps) => {
  const { toast } = useToast();

  const handleTuzemoonClick = async () => {
    if (isAdmin) {
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
          .eq("id", memeId);

        if (error) throw error;

        void onUpdate();
        
        toast({
          title: isFeatured ? "Removed from Tuzemoon" : "Added to Tuzemoon",
          description: isFeatured 
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
    } else if (isVerified) {
      toast({
        title: "Coming Soon",
        description: "Tuzemoon functionality for verified users will be available soon!",
      });
      console.log("Verified user clicked Tuzemoon button");
    }
  };

  if (!isAdmin && !isVerified) return null;

  return (
    <Button
      variant="outline"
      onClick={handleTuzemoonClick}
      className={`group ${isFeatured ? 'text-yellow-500' : ''}`}
    >
      <Moon className={`h-5 w-5 mr-2 ${isFeatured ? 'fill-current' : ''}`} />
      {isFeatured ? 'Remove from Tuzemoon' : 'Add to Tuzemoon'}
    </Button>
  );
};