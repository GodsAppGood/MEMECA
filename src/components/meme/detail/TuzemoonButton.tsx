import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TuzemoonModal } from "./TuzemoonModal";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface TuzemoonButtonProps {
  memeId: string;
  memeTitle: string;
  isFeatured: boolean;
  isAdmin: boolean;
  isVerified: boolean;
  onUpdate: () => Promise<void>;
}

export const TuzemoonButton = ({
  memeId,
  memeTitle,
  isFeatured,
  isAdmin,
  isVerified,
  onUpdate
}: TuzemoonButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleAdminActivation = async () => {
    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const tuzemoonUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      
      const { error: updateError } = await supabase
        .from('Memes')
        .update({
          is_featured: !isFeatured,
          tuzemoon_until: !isFeatured ? tuzemoonUntil : null
        })
        .eq('id', parseInt(memeId));

      if (updateError) throw updateError;

      await onUpdate();
      
      toast({
        title: !isFeatured ? "Tuzemoon Activated" : "Tuzemoon Deactivated",
        description: `Successfully ${!isFeatured ? 'activated' : 'deactivated'} Tuzemoon status`,
      });
    } catch (error: any) {
      console.error('Admin activation error:', error);
      toast({
        title: "Activation Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Check if there's a successful payment
  const { data: hasPayment } = useQuery({
    queryKey: ["tuzemoon-payment", memeId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('TuzemoonPayments')
        .select('*')
        .eq('meme_id', parseInt(memeId))
        .eq('user_id', user.id)
        .eq('transaction_status', 'success')
        .single();

      return !error && data;
    },
    enabled: !isAdmin && isVerified
  });

  if (!isVerified && !isAdmin) {
    return null;
  }

  return (
    <>
      {isAdmin ? (
        <Button
          onClick={handleAdminActivation}
          variant={isFeatured ? "secondary" : "default"}
          className="flex items-center gap-2"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Rocket className="h-4 w-4" />
          )}
          {isFeatured ? "Featured" : "Tuzemoon"}
        </Button>
      ) : hasPayment ? (
        <Button
          onClick={() => setIsModalOpen(true)}
          variant={isFeatured ? "secondary" : "destructive"}
          className="flex items-center gap-2"
          disabled={isProcessing || isFeatured}
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Rocket className="h-4 w-4" />
          )}
          {isFeatured ? "Featured" : "Activate Tuzemoon"}
        </Button>
      ) : (
        <>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="default"
            className="flex items-center gap-2"
            disabled={isProcessing}
          >
            <Rocket className="h-4 w-4" />
            Tuzemoon
          </Button>

          <TuzemoonModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            memeTitle={memeTitle}
            memeId={memeId}
          />
        </>
      )}
    </>
  );
};