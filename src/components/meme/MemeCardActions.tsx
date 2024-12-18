import { useState, useEffect } from "react";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useLikesSubscription } from "@/hooks/useLikesSubscription";

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

export const MemeCardActions = ({ meme, userLikes = [], userId, isFirst }: MemeCardActionsProps) => {
  const [isLiked, setIsLiked] = useState(userLikes.includes(meme.id));
  const [likesCount, setLikesCount] = useState(0);
  const { toast } = useToast();

  const fetchLikesCount = async () => {
    const { data, error } = await supabase
      .from("Likes")
      .select("id")
      .eq("meme_id", parseInt(meme.id));
    
    if (error) {
      console.error("Error fetching likes count:", error);
      return;
    }
    
    setLikesCount(data.length);
  };

  useEffect(() => {
    void fetchLikesCount();
  }, [meme.id]);

  useLikesSubscription(() => {
    void fetchLikesCount();
  });

  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin", userId],
    queryFn: async () => {
      if (!userId) return false;
      const { data, error } = await supabase
        .from("Users")
        .select("is_admin")
        .eq("auth_id", userId)
        .single();
      
      if (error) {
        console.error("Error checking admin status:", error);
        return false;
      }
      return data?.is_admin || false;
    },
    enabled: !!userId
  });

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to like memes",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!isLiked) {
        await supabase
          .from("Likes")
          .insert([{ 
            user_id: userId, 
            meme_id: parseInt(meme.id) 
          }]);
        setIsLiked(true);
      } else {
        await supabase
          .from("Likes")
          .delete()
          .eq("user_id", userId)
          .eq("meme_id", parseInt(meme.id));
        setIsLiked(false);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  const handleWatchlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to add to watchlist",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: existingWatch } = await supabase
        .from("Watchlist")
        .select()
        .eq("user_id", userId)
        .eq("meme_id", parseInt(meme.id))
        .single();

      if (!existingWatch) {
        await supabase
          .from("Watchlist")
          .insert([{ 
            user_id: userId, 
            meme_id: parseInt(meme.id) 
          }]);
        toast({
          title: "Success",
          description: "Added to watchlist",
        });
      } else {
        await supabase
          .from("Watchlist")
          .delete()
          .eq("user_id", userId)
          .eq("meme_id", parseInt(meme.id));
        toast({
          title: "Success",
          description: "Removed from watchlist",
        });
      }
    } catch (error) {
      console.error("Error toggling watchlist:", error);
      toast({
        title: "Error",
        description: "Failed to update watchlist",
        variant: "destructive",
      });
    }
  };

  const handleFeatureToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const { error } = await supabase
        .from("Memes")
        .update({ is_featured: !meme.is_featured })
        .eq("id", parseInt(meme.id));

      if (error) throw error;

      toast({
        title: "Success",
        description: meme.is_featured 
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

      <Button
        variant="ghost"
        size="icon"
        onClick={handleWatchlist}
        className="text-yellow-500"
      >
        <Star className="h-5 w-5" />
      </Button>
      
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