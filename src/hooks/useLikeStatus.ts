import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useLikeStatus = (memeId: string | number, userId: string | null) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const fetchLikeStatus = async () => {
    const id = typeof memeId === 'string' ? parseInt(memeId) : memeId;
    if (isNaN(id)) {
      console.error("Invalid meme ID:", memeId);
      return;
    }

    try {
      const { data: memeData, error: memeError } = await supabase
        .from("Memes")
        .select("id, likes")
        .eq("id", id)
        .single();

      if (memeError) {
        console.error("Error checking meme existence:", memeError);
        return;
      }

      if (!memeData) {
        console.error("Meme not found:", id);
        return;
      }

      setLikesCount(memeData.likes || 0);

      if (userId) {
        const { data: userLike, error: userLikeError } = await supabase
          .from("Likes")
          .select("id")
          .eq("meme_id", id)
          .eq("user_id", userId)
          .maybeSingle();

        if (userLikeError) {
          console.error("Error checking user like:", userLikeError);
          return;
        }

        setIsLiked(!!userLike);
      }
    } catch (error) {
      console.error("Error in fetchLikeStatus:", error);
    }
  };

  useEffect(() => {
    void fetchLikeStatus();
  }, [memeId, userId]);

  return {
    isLiked,
    likesCount,
    setIsLiked,
    setLikesCount,
    refetchLikeStatus: fetchLikeStatus
  };
};