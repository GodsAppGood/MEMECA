import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLikesSubscription } from "./useLikesSubscription";

export const useLikeActions = (memeId: string | number, userId: string | null) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const { toast } = useToast();

  const fetchLikesCount = async () => {
    const id = typeof memeId === 'string' ? parseInt(memeId) : memeId;
    if (isNaN(id)) {
      console.error("Invalid meme ID:", memeId);
      return;
    }

    try {
      const { data: likesData, error: likesError } = await supabase
        .from("Likes")
        .select("id")
        .eq("meme_id", id);
      
      if (likesError) {
        console.error("Error fetching likes count:", likesError);
        return;
      }
      
      setLikesCount(likesData.length);

      if (userId) {
        const { data: userLike } = await supabase
          .from("Likes")
          .select("id")
          .eq("meme_id", id)
          .eq("user_id", userId)
          .single();

        setIsLiked(!!userLike);
      }
    } catch (error) {
      console.error("Error in fetchLikesCount:", error);
    }
  };

  useEffect(() => {
    void fetchLikesCount();
  }, [memeId, userId]);

  useLikesSubscription(() => {
    void fetchLikesCount();
  });

  const handleLike = async () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to like memes",
        variant: "destructive",
      });
      return;
    }

    const id = typeof memeId === 'string' ? parseInt(memeId) : memeId;
    if (isNaN(id)) {
      console.error("Invalid meme ID:", memeId);
      return;
    }

    try {
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
    } catch (error: any) {
      console.error("Error liking meme:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to like meme",
        variant: "destructive",
      });
    }
  };

  const handleUnlike = async () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to unlike memes",
        variant: "destructive",
      });
      return;
    }

    const id = typeof memeId === 'string' ? parseInt(memeId) : memeId;
    if (isNaN(id)) {
      console.error("Invalid meme ID:", memeId);
      return;
    }

    try {
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
    } catch (error: any) {
      console.error("Error unliking meme:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to unlike meme",
        variant: "destructive",
      });
    }
  };

  return {
    isLiked,
    likesCount,
    handleLike,
    handleUnlike
  };
};