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
      console.log('Starting Tuzemoon activation for signature:', signature);
      
      // Create TuzemoonPayment record with retry logic
      const maxRetries = 3;
      let paymentError = null;
      
      for (let i = 0; i < maxRetries; i++) {
        const { error } = await supabase
          .from('TuzemoonPayments')
          .insert([{
            meme_id: parseInt(memeId),
            user_id: userId,
            transaction_signature: signature,
            amount: 0.1,
            transaction_status: 'success'
          }]);

        if (!error) {
          paymentError = null;
          break;
        }

        paymentError = error;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (paymentError) {
        console.error('Failed to create TuzemoonPayment record after retries:', paymentError);
        throw new Error('Failed to record payment');
      }

      // Activate Tuzemoon status with retry logic
      const tuzemoonUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      let updateError = null;
      
      for (let i = 0; i < maxRetries; i++) {
        const { error } = await supabase
          .from('Memes')
          .update({
            is_featured: true,
            tuzemoon_until: tuzemoonUntil
          })
          .eq('id', parseInt(memeId));

        if (!error) {
          updateError = null;
          break;
        }

        updateError = error;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (updateError) {
        console.error('Tuzemoon activation failed after retries:', updateError);
        throw new Error('Failed to activate Tuzemoon status');
      }

      return { success: true };
    } catch (error) {
      console.error('Error in activateTuzemoon:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error occurred' 
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
          description: `Payment successful but Tuzemoon activation failed. Please contact support.`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Payment process error:', {
        error: error.message,
        memeId,
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Payment Failed",
        description: "Network error occurred. Please try again later.",
        variant: "destructive",
      });
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
          onClose={() => setIsModalOpen(false)}
          onConfirm={handlePayment}
          isProcessing={isProcessing}
        />
      )}
    </>
  );
};