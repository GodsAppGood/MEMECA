import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const useLikeActions = (memeId: string | number, userId: string | null) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchLikesCount = async () => {
    const id = typeof memeId === 'string' ? parseInt(memeId) : memeId;
    if (isNaN(id)) {
      console.error("Invalid meme ID:", memeId);
      return;
    }

    try {
      // First check if the meme exists
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
      console.error("Error in fetchLikesCount:", error);
    }
  };

  useEffect(() => {
    void fetchLikesCount();
  }, [memeId, userId]);

  // Subscribe to real-time updates for likes
  useEffect(() => {
    const channel = supabase
      .channel('likes_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public',
          table: 'Likes',
          filter: `meme_id=eq.${memeId}`
        },
        () => {
          console.log("Likes changed, refetching...");
          void fetchLikesCount();
          // Invalidate related queries to trigger refetch
          void queryClient.invalidateQueries({ queryKey: ['memes'] });
          void queryClient.invalidateQueries({ queryKey: ['user-likes'] });
          void queryClient.invalidateQueries({ queryKey: ['featured-memes'] });
          void queryClient.invalidateQueries({ queryKey: ['watchlist-memes'] });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [memeId, queryClient]);

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
      // Optimistically update UI
      setIsLiked(true);
      setLikesCount(prev => prev + 1);

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
          // Revert optimistic update
          setIsLiked(false);
          setLikesCount(prev => prev - 1);
          return;
        }
        throw insertError;
      }
      
      toast({
        title: "Success",
        description: "Meme liked successfully",
      });
    } catch (error: any) {
      console.error("Error liking meme:", error);
      // Revert optimistic update
      setIsLiked(false);
      setLikesCount(prev => prev - 1);
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
      // Optimistically update UI
      setIsLiked(false);
      setLikesCount(prev => Math.max(0, prev - 1));

      const { error: deleteError } = await supabase
        .from("Likes")
        .delete()
        .eq("user_id", userId)
        .eq("meme_id", id);

      if (deleteError) throw deleteError;
      
      toast({
        title: "Success",
        description: "Like removed successfully",
      });
    } catch (error: any) {
      console.error("Error unliking meme:", error);
      // Revert optimistic update
      setIsLiked(true);
      setLikesCount(prev => prev + 1);
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