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

  const verifyAndActivateTuzemoon = async (signature: string) => {
    try {
      console.log('Starting Tuzemoon verification for signature:', signature);

      // Initial delay to ensure transaction is processed
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Wait for the payment record to be properly created and processed
      for (let attempt = 0; attempt < 8; attempt++) {
        console.log(`Verification attempt ${attempt + 1} of 8`);

        // First verify the transaction is recorded
        const { data: transactionData, error: transactionError } = await supabase
          .from('TransactionLogs')
          .select('*')
          .eq('transaction_signature', signature)
          .eq('transaction_status', 'success')
          .single();

        if (transactionError || !transactionData) {
          console.log(`Transaction verification pending... (attempt ${attempt + 1})`);
          await new Promise(resolve => setTimeout(resolve, 3000));
          continue;
        }

        console.log('Transaction verified:', transactionData);

        // Then verify the Tuzemoon payment
        const { data: paymentData, error: paymentError } = await supabase
          .from('TuzemoonPayments')
          .select('*')
          .eq('transaction_signature', signature)
          .single();

        if (paymentError || !paymentData) {
          console.log(`Payment record pending... (attempt ${attempt + 1})`);
          
          // Create TuzemoonPayment record if it doesn't exist
          const { error: insertError } = await supabase
            .from('TuzemoonPayments')
            .insert([{
              meme_id: parseInt(memeId),
              user_id: transactionData.user_id,
              transaction_signature: signature,
              amount: transactionData.amount,
              transaction_status: 'success',
              wallet_address: transactionData.wallet_address
            }]);

          if (insertError) {
            console.error('Failed to create TuzemoonPayment record:', insertError);
          }

          await new Promise(resolve => setTimeout(resolve, 3000));
          continue;
        }

        console.log('Payment record verified:', paymentData);

        // Activate Tuzemoon
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
          return { success: false, error: 'Failed to activate Tuzemoon status' };
        }

        console.log('Tuzemoon activated successfully');
        return { success: true };
      }

      return { 
        success: false, 
        error: 'Payment verification timeout - please try refreshing the page or contact support if the issue persists.' 
      };
    } catch (error) {
      console.error('Error in verifyAndActivateTuzemoon:', error);
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

      console.log('Payment successful, verifying and activating Tuzemoon...');
      const { success: activationSuccess, error: activationError } = await verifyAndActivateTuzemoon(signature);

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

      const errorMessage = error.message || "Something went wrong";
      
      if (retryCount < 2) {
        setRetryCount(prev => prev + 1);
        toast({
          title: "Payment Failed - Retrying",
          description: `${errorMessage}. Attempt ${retryCount + 1} of 3...`,
          variant: "destructive",
        });
        await handlePayment();
      } else {
        toast({
          title: "Payment Failed",
          description: `${errorMessage}. Maximum retry attempts reached. Please try again later.`,
          variant: "destructive",
        });
        setRetryCount(0);
      }
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