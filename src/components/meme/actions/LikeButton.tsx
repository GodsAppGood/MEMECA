import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LikeButtonProps {
  isLiked: boolean;
  onClick: () => void;
  disabled: boolean;
  likesCount: number;
  userId?: string | null;
}

export const LikeButton = ({ 
  isLiked, 
  onClick, 
  disabled, 
  likesCount,
  userId 
}: LikeButtonProps) => {
  const { toast } = useToast();
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from('Users')
          .select('is_verified')
          .eq('auth_id', userId)
          .single();

        if (error) {
          console.error('Error checking verification status:', error);
          return;
        }

        setIsVerified(data?.is_verified || false);
      } catch (error) {
        console.error('Error in verification check:', error);
      }
    };

    void checkVerificationStatus();
  }, [userId]);

  const handleClick = async () => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like memes",
        variant: "destructive",
      });
      return;
    }

    if (!isVerified) {
      toast({
        title: "Verification Required",
        description: "You must verify your account to use this feature",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onClick();
    } catch (error) {
      console.error('Error processing like:', error);
      toast({
        title: "Error",
        description: "Unable to process your like. Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`hover:text-red-500 transition-colors duration-200 ${
        isLiked ? 'text-red-500' : ''
      }`}
      aria-label={isLiked ? 'Unlike' : 'Like'}
    >
      <Heart 
        className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} 
      />
      {likesCount > 0 && (
        <span className="ml-2 text-sm">{likesCount}</span>
      )}
    </Button>
  );
};