import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Rocket, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendSolPayment } from "@/services/phantom-payment";
import { TuzemoonModal } from "./TuzemoonModal";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  const activateTuzemoon = async (userId: string, signature?: string) => {
    try {
      console.log('Starting Tuzemoon activation:', {
        memeId,
        userId,
        signature,
        isAdmin
      });

      const tuzemoonUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      if (signature) {
        console.log('Recording payment with signature:', signature);
        const { error: paymentError } = await supabase
          .from('TuzemoonPayments')
          .insert([{
            meme_id: parseInt(memeId),
            user_id: userId,
            transaction_signature: signature,
            amount: 0.1,
            transaction_status: 'success',
            wallet_address: window.solana?.publicKey?.toString()
          }]);

        if (paymentError) {
          console.error('Payment record creation failed:', paymentError);
          throw new Error('Failed to record payment');
        }
      }

      console.log('Updating meme Tuzemoon status...');
      const { error: updateError } = await supabase
        .from('Memes')
        .update({
          is_featured: !isFeatured,
          tuzemoon_until: !isFeatured ? tuzemoonUntil : null
        })
        .eq('id', parseInt(memeId));

      if (updateError) {
        console.error('Meme status update failed:', updateError);
        throw new Error('Failed to activate Tuzemoon status');
      }

      await queryClient.invalidateQueries({ queryKey: ['memes'] });
      await queryClient.invalidateQueries({ queryKey: ['meme', memeId] });
      await onUpdate();

      toast({
        title: !isFeatured ? "Tuzemoon Activated" : "Tuzemoon Deactivated",
        description: `Successfully ${!isFeatured ? 'activated' : 'deactivated'} Tuzemoon status for this meme`,
      });

      return true;
    } catch (error: any) {
      console.error('Tuzemoon activation error:', error);
      toast({
        title: "Activation Failed",
        description: error.message || "Failed to update Tuzemoon status",
        variant: "destructive",
      });
      return false;
    }
  };

  const handlePayment = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      if (!window.solana?.isPhantom) {
        window.open("https://phantom.app/", "_blank");
        throw new Error("Please install Phantom wallet");
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Please sign in to continue");
      }

      // Ensure wallet is connected and show connection popup if needed
      if (!window.solana.isConnected) {
        toast({
          title: "Connecting Wallet",
          description: "Please approve the connection request in Phantom",
        });
        await window.solana.connect();
      }

      // Get the current balance before proceeding
      const connection = new window.solana.Connection("https://api.mainnet-beta.solana.com");
      const balance = await connection.getBalance(window.solana.publicKey);
      const requiredAmount = 0.1 * 1000000000; // 0.1 SOL in lamports

      if (balance < requiredAmount) {
        throw new Error("Insufficient SOL balance. Please add funds to your wallet.");
      }

      console.log('Processing payment...');
      const { success, signature, error } = await sendSolPayment(memeId, memeTitle);

      if (!success || !signature) {
        throw new Error(error || "Payment failed");
      }

      console.log('Payment successful, activating Tuzemoon...');
      const activationSuccess = await activateTuzemoon(user.id, signature);

      if (activationSuccess) {
        setIsModalOpen(false);
      }
    } catch (error: any) {
      console.error('Payment/activation error:', error);
      toast({
        title: "Process Failed",
        description: error.message || "Failed to complete the process",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdminActivation = async () => {
    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      await activateTuzemoon(user.id);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClick = () => {
    if (isAdmin) {
      handleAdminActivation();
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
          onConfirm={handlePayment}
          isProcessing={isProcessing}
        />
      )}
    </>
  );
};