import { Button } from "@/components/ui/button";
import { Star, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Meme } from "@/types/meme";
import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import { useWatchlistStore } from "@/stores/watchlistStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface MemeActionsProps {
  meme: Meme;
  userId: string | null;
  onUpdate: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<any, Error>>;
}

export const MemeActions = ({ meme, userId, onUpdate }: MemeActionsProps) => {
  const { toast } = useToast();
  const [showTuzemoonDialog, setShowTuzemoonDialog] = useState(false);
  const { isInWatchlist, toggleWatchlist } = useWatchlistStore();
  const isWatchlisted = isInWatchlist(meme.id.toString());

  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin", userId],
    queryFn: async () => {
      if (!userId) return false;
      const { data, error } = await supabase
        .from("Users")
        .select("is_admin")
        .eq("auth_id", userId)
        .single();
      
      if (error) return false;
      return data?.is_admin || false;
    },
    enabled: !!userId
  });

  const handleTuzemoonToggle = async () => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add memes to Tuzemoon",
        variant: "destructive"
      });
      return;
    }

    if (isAdmin) {
      await addToTuzemoon();
    } else {
      setShowTuzemoonDialog(true);
    }
  };

  const addToTuzemoon = async () => {
    try {
      const tuzemoonUntil = meme.is_featured 
        ? null 
        : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      const { error } = await supabase
        .from("Memes")
        .update({ 
          is_featured: !meme.is_featured,
          tuzemoon_until: tuzemoonUntil
        })
        .eq("id", meme.id);

      if (error) throw error;

      void onUpdate();
      
      toast({
        title: meme.is_featured ? "Removed from Tuzemoon" : "Added to Tuzemoon",
        description: meme.is_featured 
          ? "The meme has been removed from Tuzemoon" 
          : "The meme has been added to Tuzemoon for 24 hours",
      });
    } catch (error) {
      console.error("Error toggling Tuzemoon status:", error);
      toast({
        title: "Error",
        description: "Failed to update Tuzemoon status",
        variant: "destructive",
      });
    }
  };

  const handleWatchlistToggle = async () => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add memes to your watchlist",
        variant: "destructive"
      });
      return;
    }

    try {
      await toggleWatchlist(meme.id.toString(), userId);
      toast({
        title: isWatchlisted ? "Removed from Watchlist" : "Added to Watchlist",
        description: isWatchlisted 
          ? "The meme has been removed from your watchlist" 
          : "The meme has been added to your watchlist",
      });
    } catch (error) {
      console.error("Error toggling watchlist:", error);
      toast({
        title: "Error",
        description: "Failed to update watchlist status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={handleWatchlistToggle}
        className={`group ${isWatchlisted ? 'bg-yellow-50' : ''}`}
      >
        <Star className={`h-5 w-5 mr-2 ${isWatchlisted ? 'fill-yellow-500 text-yellow-500' : ''}`} />
        {isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
      </Button>

      {(isAdmin || userId) && (
        <Button
          variant="outline"
          onClick={handleTuzemoonToggle}
          className={`group ${meme.is_featured ? 'bg-orange-50' : ''}`}
        >
          <Flame className={`h-5 w-5 mr-2 ${meme.is_featured ? 'fill-orange-500 text-orange-500' : ''}`} />
          {meme.is_featured ? 'Remove from Tuzemoon' : 'Add to Tuzemoon'}
        </Button>
      )}

      <AlertDialog open={showTuzemoonDialog} onOpenChange={setShowTuzemoonDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Welcome to Tuzemoon by Memeca!</AlertDialogTitle>
            <AlertDialogDescription>
              To add this meme to Tuzemoon, you'll need to pay 0.1 Solana.
              This feature is coming soon!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setShowTuzemoonDialog(false);
              toast({
                title: "Coming Soon",
                description: "Solana payments will be available soon!",
              });
            }}>
              Pay 0.1 SOL
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};