import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EditButton } from "./actions/EditButton";
import { DeleteButton } from "./actions/DeleteButton";
import { useFeatureToggle } from "@/hooks/useFeatureToggle";
import { useToast } from "@/hooks/use-toast";
import { useLikeActions } from "@/hooks/useLikeActions";
import { formatNumber } from "@/utils/formatNumber";
import { MemeWithStringId } from "@/types/meme";

interface MemeCardActionsProps {
  meme: Pick<MemeWithStringId, 'id' | 'is_featured' | 'created_by' | 'title' | 'likes'>;
  userLikes?: string[];
  userPoints?: number;
  userId?: string | null;
  isFirst?: boolean;
  className?: string;
}

export const MemeCardActions = ({ 
  meme, 
  userId, 
  isFirst,
  className 
}: MemeCardActionsProps) => {
  if (meme.isPlaceholder) {
    return null;
  }

  const { isLiked, likesCount, handleLike } = useLikeActions(meme.id, userId || null);
  const { handleFeatureToggle } = useFeatureToggle(meme.id, meme.is_featured || false);
  const { toast } = useToast();

  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin", userId],
    queryFn: async () => {
      if (!userId) return false;
      const { data, error } = await supabase
        .from("Users")
        .select("is_admin")
        .eq("auth_id", userId)
        .maybeSingle();
      
      if (error) {
        console.error("Error checking admin status:", error);
        return false;
      }
      return data?.is_admin || false;
    },
    enabled: !!userId
  });

  const handleFeatureClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const tuzemoonUntil = !meme.is_featured 
        ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        : null;

      const { error } = await supabase
        .from("Memes")
        .update({ 
          is_featured: !meme.is_featured,
          tuzemoon_until: tuzemoonUntil
        })
        .eq("id", meme.id);

      if (error) throw error;

      await handleFeatureToggle();
      toast({
        title: meme.is_featured ? "Removed from Tuzemoon" : "Added to Tuzemoon",
        description: meme.is_featured 
          ? "The meme has been removed from Tuzemoon" 
          : "The meme has been added to Tuzemoon for 24 hours",
      });
    } catch (error) {
      console.error("Error toggling feature status:", error);
      toast({
        title: "Error",
        description: "Failed to update Tuzemoon status. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className || ''}`} onClick={(e) => e.stopPropagation()}>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLike}
        className={`group relative ${isLiked ? "text-red-500" : ""}`}
        disabled={!userId}
      >
        <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
        <span className="ml-1">{formatNumber(likesCount)}</span>
        {!userId && (
          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Login to like memes
          </span>
        )}
      </Button>

      {isAdmin && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleFeatureClick}
          className={`group relative ${meme.is_featured ? "text-yellow-500" : ""}`}
          title={meme.is_featured ? "Remove from Tuzemoon" : "Add to Tuzemoon"}
        >
          <Star className={`h-5 w-5 ${meme.is_featured ? "fill-current" : ""}`} />
          <span className="sr-only">
            {meme.is_featured ? "Remove from Tuzemoon" : "Add to Tuzemoon"}
          </span>
          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {meme.is_featured ? "Remove from Tuzemoon" : "Add to Tuzemoon"}
          </span>
        </Button>
      )}

      <EditButton meme={meme} userId={userId || null} />
      <DeleteButton meme={meme} userId={userId || null} />
    </div>
  );
};