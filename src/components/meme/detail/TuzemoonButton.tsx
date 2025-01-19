import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TuzemoonModal } from "./TuzemoonModal";
import { supabase } from "@/integrations/supabase/client";

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
        title: "Activation Failed",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      await onUpdate();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating meme status:', error);
    }
  };

  if (!isVerified && !isAdmin) {
    return null;
  }

  return (
    <>
      <Button
        onClick={isAdmin ? handleAdminActivation : () => setIsModalOpen(true)}
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

      {!isAdmin && (
        <TuzemoonModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handlePaymentSuccess}
          isProcessing={isProcessing}
          memeTitle={memeTitle}
          memeId={memeId}
        />
      )}
    </>
  );
};