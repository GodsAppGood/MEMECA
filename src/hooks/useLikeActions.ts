import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLikeStatus } from "./useLikeStatus";
import { useRealtimeLikes } from "./useRealtimeLikes";

export const useLikeActions = (memeId: string | number, userId: string | null) => {
  const { toast } = useToast();
  const {
    isLiked,
    likesCount,
    setIsLiked,
    setLikesCount,
    refetchLikeStatus
  } = useLikeStatus(memeId, userId);

  // Set up realtime subscription
  useRealtimeLikes(memeId);

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
    handleUnlike,
    refetchLikeStatus
  };
};