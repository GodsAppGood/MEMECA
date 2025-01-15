import { useState } from "react";
import { DeleteButton } from "./actions/DeleteButton";
import { LikeButton } from "./actions/LikeButton";
import { useToast } from "@/hooks/use-toast";
import { useLikeActions } from "@/hooks/useLikeActions";
import { useRealtimeLikes } from "@/hooks/useRealtimeLikes";
import { formatNumber } from "@/utils/formatNumber";
import { Meme } from "@/types/meme";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MemeCardActionsProps {
  meme: Pick<Meme, 'id' | 'is_featured' | 'created_by' | 'title' | 'likes'>;
  userLikes?: string[];
  userPoints?: number;
  userId?: string | null;
  isFirst?: boolean;
  className?: string;
}

export const MemeCardActions = ({
  meme,
  userLikes = [],
  userPoints = 0,
  userId,
  isFirst,
  className = ""
}: MemeCardActionsProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const { handleLike, handleUnlike } = useLikeActions(meme.id.toString(), userId);
  const isLiked = userLikes?.includes(meme.id.toString());

  // Check if user is verified
  const { data: userData } = useQuery({
    queryKey: ['user-verification', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('Users')
        .select('is_verified')
        .eq('auth_id', userId)
        .single();
      
      if (error) {
        console.error('Error checking user verification:', error);
        return null;
      }
      return data;
    },
    enabled: !!userId
  });

  // Subscribe to realtime likes updates
  useRealtimeLikes(meme.id);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like memes",
        variant: "destructive"
      });
      return;
    }

    if (!userData?.is_verified) {
      toast({
        title: "Verification Required",
        description: "Your account needs to be verified to like memes",
        variant: "destructive"
      });
      return;
    }

    if (isProcessing) {
      return;
    }

    try {
      setIsProcessing(true);
      console.log('Processing like action:', { 
        memeId: meme.id, 
        userId, 
        isLiked,
        userVerified: userData?.is_verified 
      });
      
      if (isLiked) {
        await handleUnlike();
        console.log('Successfully unliked meme:', meme.id);
      } else {
        if (userPoints < 1) {
          toast({
            title: "Not enough points",
            description: "You need at least 1 point to like a meme",
            variant: "destructive",
          });
          return;
        }
        await handleLike();
        console.log('Successfully liked meme:', meme.id);
      }
    } catch (error: any) {
      console.error("Like action failed:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process like action",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`flex items-center justify-between px-4 py-4 mt-2 border-t ${className}`}>
      <div className="flex items-center space-x-4">
        <LikeButton
          isLiked={isLiked}
          onClick={handleLikeClick}
          disabled={isProcessing || !userData?.is_verified}
          likesCount={meme.likes}
        />
        <span className="text-sm font-medium transition-all duration-200">
          {formatNumber(meme.likes || 0)}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <DeleteButton meme={{ ...meme, id: meme.id.toString() }} userId={userId} />
      </div>
    </div>
  );
};