import { useState, useEffect } from "react";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useLikesSubscription } from "@/hooks/useLikesSubscription";
import { WatchlistButton } from "./actions/WatchlistButton";

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

  // Fetch initial likes count
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

  // Subscribe to likes changes
  useLikesSubscription(() => {
    void fetchLikesCount();
  });

  // Check if user is admin
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

  // Handle like toggle
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
        const { error: insertError } = await supabase
          .from("Likes")
          .insert([{ 
            user_id: userId, 
            meme_id: parseInt(meme.id) 
          }]);

        if (insertError) {
          if (insertError.code === '23505') { // Unique violation
            toast({
              title: "Already liked",
              description: "You have already liked this meme",
              variant: "destructive",
            });
            return;
          }
          throw insertError;
        }
        
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      } else {
        const { error: deleteError } = await supabase
          .from("Likes")
          .delete()
          .eq("user_id", userId)
          .eq("meme_id", parseInt(meme.id));

        if (deleteError) throw deleteError;
        
        setIsLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
      }
    } catch (error: any) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  // Handle feature toggle (admin only)
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