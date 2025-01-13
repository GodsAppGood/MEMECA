import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendSolPayment } from "@/services/phantom-payment";
import { TuzemoonModal } from "./TuzemoonModal";
import { supabase } from "@/integrations/supabase/client";

interface TuzemoonButtonProps {
  memeId: string;
  memeTitle: string;
  isFeatured: boolean;
  isAdmin: boolean;
  isVerified: boolean;
  onUpdate: () => Promise<any>;
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
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  const handleAdminTuzemoon = async () => {
    setIsProcessing(true);
    try {
      console.log('Admin updating Tuzemoon status for meme:', memeId);
      
      const tuzemoonUntil = !isFeatured ? 
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : 
        null;

      const { error } = await supabase
        .from('Memes')
        .update({ 
          is_featured: !isFeatured,
          tuzemoon_until: tuzemoonUntil
        })
        .eq('id', parseInt(memeId));

      if (error) throw error;

      await onUpdate();
      
      toast({
        title: !isFeatured ? "Tuzemoon Activated" : "Tuzemoon Deactivated",
        description: `Successfully ${!isFeatured ? 'added to' : 'removed from'} Tuzemoon`,
      });

    } catch (error: any) {
      console.error('Admin Tuzemoon update error:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update Tuzemoon status",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const activateTuzemoon = async (signature: string, userId: string) => {
    try {
      console.log('Activating Tuzemoon for signature:', signature);
      
      // Create TuzemoonPayment record
      const { error: paymentError } = await supabase
        .from('TuzemoonPayments')
        .insert([{
          meme_id: parseInt(memeId),
          user_id: userId,
          transaction_signature: signature,
          amount: 0.1,
          transaction_status: 'success',
          wallet_address: null // Will be updated by the transaction log
        }]);

      if (paymentError) {
        console.error('Failed to create TuzemoonPayment record:', paymentError);
        throw new Error('Failed to record payment');
      }

      // Activate Tuzemoon status
      const tuzemoonUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      
      const { error: updateError } = await supabase
        .from('Memes')
        .update({
          is_featured: true,
          tuzemoon_until: tuzemoonUntil
        })
        .eq('id', parseInt(memeId));

      if (updateError) {
        console.error('Tuzemoon activation failed:', updateError);
        throw new Error('Failed to activate Tuzemoon status');
      }

      return { success: true };
    } catch (error) {
      console.error('Error in activateTuzemoon:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  };

  const handlePayment = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      if (!window.solana || !window.solana.isPhantom) {
        toast({
          title: "Wallet Not Found",
          description: "Please install Phantom Wallet to proceed with the payment",
          variant: "destructive",
        });
        window.open('https://phantom.app/', '_blank');
        return;
      }

      try {
        console.log('Connecting to Phantom wallet...');
        await window.solana.connect();
      } catch (err) {
        console.error('Failed to connect wallet:', err);
        toast({
          title: "Connection Failed",
          description: "Failed to connect to Phantom wallet. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('Starting payment process...');
      const { success, signature, error } = await sendSolPayment(memeId, memeTitle);

      if (!success || !signature) {
        throw new Error(error || "Payment failed");
      }

      // Get current user ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      console.log('Payment successful, activating Tuzemoon...');
      const { success: activationSuccess, error: activationError } = await activateTuzemoon(signature, user.id);

      if (activationSuccess) {
        toast({
          title: "Tuzemoon Activated",
          description: "Payment confirmed and Tuzemoon status activated!",
        });
        setIsModalOpen(false);
        await onUpdate();
      } else {
        console.error('Activation error:', activationError);
        toast({
          title: "Activation Failed",
          description: `Payment successful but Tuzemoon activation failed: ${activationError}`,
          variant: "destructive",
        });
      }

      setRetryCount(0);
    } catch (error: any) {
      console.error('Payment process error:', {
        error: error.message,
        memeId,
        retryCount,
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Payment Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      setRetryCount(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClick = () => {
    if (isAdmin) {
      handleAdminTuzemoon();
    } else {
      setIsModalOpen(true);
    }
  };

  if (!isVerified && !isAdmin) {
    return null;
  }

  return (
    <>
      <Button
        onClick={handleClick}
        variant={isFeatured ? "secondary" : "default"}
        className="flex items-center gap-2"
        disabled={isProcessing}
      >
        <Rocket className="h-4 w-4" />
        {isFeatured ? "Featured" : "Tuzemoon"}
      </Button>

      {!isAdmin && (
        <TuzemoonModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setRetryCount(0);
          }}
          onConfirm={handlePayment}
          isProcessing={isProcessing}
        />
      )}
    </>
  );
};
