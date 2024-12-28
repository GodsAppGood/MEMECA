import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLikesSubscription } from "./useLikesSubscription";

export const useLikeActions = (memeId: string, userId: string | null) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const { toast } = useToast();

  const fetchLikesCount = async () => {
    // Skip fetching for placeholder memes
    if (memeId.startsWith('placeholder-')) {
      return;
    }

    const id = parseInt(memeId);
    if (isNaN(id)) {
      console.error("Invalid meme ID:", memeId);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("Likes")
        .select("id")
        .eq("meme_id", id);
      
      if (error) {
        console.error("Error fetching likes count:", error);
        return;
      }
      
      setLikesCount(data.length);
    } catch (error) {
      console.error("Error in fetchLikesCount:", error);
    }
  };

  useEffect(() => {
    void fetchLikesCount();
  }, [memeId]);

  useLikesSubscription(() => {
    void fetchLikesCount();
  });

  const handleLike = async () => {
    // Prevent liking placeholder memes
    if (memeId.startsWith('placeholder-')) {
      return;
    }

    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to like memes",
        variant: "destructive",
      });
      return;
    }

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
      if (!isLiked) {
        const { error: insertError } = await supabase
          .from("Likes")
          .insert([{ 
            user_id: userId, 
            meme_id: id 
          }]);

        if (insertError) {
          if (insertError.code === '23505') {
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
        
        toast({
          title: "Success",
          description: "Meme liked successfully",
        });
      } else {
        const { error: deleteError } = await supabase
          .from("Likes")
          .delete()
          .eq("user_id", userId)
          .eq("meme_id", id);

        if (deleteError) throw deleteError;
        
        setIsLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
        
        toast({
          title: "Success",
          description: "Like removed successfully",
        });
      }
    } catch (error: any) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  return {
    isLiked,
    likesCount,
    handleLike
  };
};