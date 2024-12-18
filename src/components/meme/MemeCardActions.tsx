import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WatchlistButton } from "./actions/WatchlistButton";
import { useLikeActions } from "@/hooks/useLikeActions";
import { useFeatureToggle } from "@/hooks/useFeatureToggle";

interface MemeCardActionsProps {
  meme: {
    id: string;
    is_featured?: boolean;
  };
  userLikes?: string[];
  userPoints?: number;
  userId?: string | null;
  isFirst?: boolean;
}

export const MemeCardActions = ({ 
  meme, 
  userLikes = [], 
  userId, 
  isFirst 
}: MemeCardActionsProps) => {
  const { isLiked, likesCount, handleLike } = useLikeActions(meme.id, userId || null);
  const { handleFeatureToggle } = useFeatureToggle(meme.id, meme.is_featured || false);

  // Check if user is admin
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

  return (
    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLike}
        className={isLiked ? "text-red-500" : ""}
      >
        <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
        <span className="ml-1">{likesCount}</span>
      </Button>

      <WatchlistButton memeId={meme.id} userId={userId || null} />
      
      {isAdmin && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleFeatureToggle}
          className={meme.is_featured ? "text-yellow-500" : ""}
        >
          <Star className={`h-5 w-5 ${meme.is_featured ? "fill-current" : ""}`} />
        </Button>
      )}
    </div>
  );
};