import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Meme } from "@/types/meme";
import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WatchlistButton } from "./actions/WatchlistButton";
import { TuzemoonButton } from "./actions/TuzemoonButton";
import { SolanaPaymentDialog } from "./actions/SolanaPaymentDialog";

interface MemeActionsProps {
  meme: Meme;
  userId: string | null;
  onUpdate: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<any, Error>>;
}

export const MemeActions = ({ meme, userId, onUpdate }: MemeActionsProps) => {
  const { toast } = useToast();
  const [showTuzemoonDialog, setShowTuzemoonDialog] = useState(false);

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

  const handlePaymentSuccess = async () => {
    try {
      const tuzemoonUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const { error } = await supabase
        .from("Memes")
        .update({ 
          is_featured: true,
          tuzemoon_until: tuzemoonUntil
        })
        .eq("id", meme.id);

      if (error) throw error;
      void onUpdate();
      
      toast({
        title: "Success",
        description: "Your meme has been added to Tuzemoon!",
      });
    } catch (error) {
      console.error("Error adding to Tuzemoon:", error);
      toast({
        title: "Error",
        description: "Failed to add meme to Tuzemoon",
        variant: "destructive",
      });
    }
  };

  const handlePaymentError = (error: Error) => {
    toast({
      title: "Payment Failed",
      description: error.message || "Failed to process payment. Please try again.",
      variant: "destructive"
    });
  };

  return (
    <div className="flex gap-2">
      <WatchlistButton meme={meme} userId={userId} />
      <TuzemoonButton meme={meme} isAdmin={!!isAdmin} onUpdate={onUpdate} />
      
      <SolanaPaymentDialog
        open={showTuzemoonDialog}
        onOpenChange={setShowTuzemoonDialog}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  );
};