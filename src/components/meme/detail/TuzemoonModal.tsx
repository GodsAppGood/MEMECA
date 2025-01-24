import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PublicKey } from "@solana/web3.js";
import { phantomWallet } from "@/services/phantom-wallet";
import { WalletConnection } from "./tuzemoon/WalletConnection";
import { PaymentDetails } from "./tuzemoon/PaymentDetails";
import { TransactionStatus } from "./tuzemoon/TransactionStatus";
import { useQueryClient } from "@tanstack/react-query";

interface TuzemoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isProcessing: boolean;
  memeTitle: string;
  memeId: string;
}

export const TuzemoonModal = ({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
  memeTitle,
  memeId
}: TuzemoonModalProps) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<'initial' | 'confirming' | 'success' | 'error'>('initial');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handlePayment = async () => {
    try {
      setIsPaymentProcessing(true);
      setTransactionStatus('confirming');
      
      const walletAddress = await phantomWallet.getAddress();
      if (!walletAddress) throw new Error('No wallet connected');

      const { data: { TUZEMOON_WALLET_ADDRESS } } = await supabase.functions.invoke('get-tuzemoon-wallet');
      if (!TUZEMOON_WALLET_ADDRESS) throw new Error('Recipient wallet not configured');

      const recipientPubKey = new PublicKey(TUZEMOON_WALLET_ADDRESS);
      const amount = 0.1 * 1000000000; // Convert to lamports

      const transaction = await phantomWallet.createTransferTransaction(
        recipientPubKey,
        amount
      );

      const signature = await phantomWallet.signAndSendTransaction(transaction);
      setTransactionSignature(signature);

      // Record the payment
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error: paymentError } = await supabase
        .from('TuzemoonPayments')
        .insert({
          user_id: user.id,
          meme_id: parseInt(memeId),
          transaction_signature: signature,
          amount: 0.1,
          transaction_status: 'success',
          wallet_address: walletAddress
        });

      if (paymentError) throw paymentError;

      // Update UI
      await queryClient.invalidateQueries({ queryKey: ['meme', memeId] });
      await queryClient.invalidateQueries({ queryKey: ['memes'] });
      await queryClient.invalidateQueries({ queryKey: ['tuzemoon-payment', memeId] });

      setTransactionStatus('success');
      
      toast({
        title: "Payment Successful",
        description: "Now you can activate Tuzemoon",
      });

    } catch (error: any) {
      console.error('Payment error:', error);
      setTransactionStatus('error');
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  const handleActivation = async () => {
    try {
      await onConfirm();
      onClose();
      toast({
        title: "Tuzemoon Activated",
        description: "Your meme will be featured for 24 hours",
      });
    } catch (error: any) {
      console.error('Activation error:', error);
      toast({
        title: "Activation Error",
        description: error.message || "Failed to activate Tuzemoon",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Activate Tuzemoon</DialogTitle>
          <DialogDescription>
            Feature "{memeTitle}" on Tuzemoon for 24 hours
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!isWalletConnected && (
            <WalletConnection onConnect={setIsWalletConnected} />
          )}

          {isWalletConnected && !isPaymentProcessing && transactionStatus === 'initial' && (
            <PaymentDetails memeTitle={memeTitle} />
          )}

          {(isPaymentProcessing || transactionStatus !== 'initial') && (
            <TransactionStatus 
              status={transactionStatus}
              signature={transactionSignature}
            />
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isPaymentProcessing || transactionStatus === 'confirming'}
          >
            Cancel
          </Button>
          {isWalletConnected && transactionStatus === 'initial' && !isPaymentProcessing && (
            <Button 
              onClick={handlePayment}
              disabled={isPaymentProcessing}
              className="min-w-[140px]"
            >
              Pay 0.1 SOL
            </Button>
          )}
          {transactionStatus === 'success' && (
            <Button
              onClick={handleActivation}
              variant="default"
              className="min-w-[140px] bg-yellow-500 hover:bg-yellow-600"
            >
              Tuzemoon
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};