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

interface TuzemoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
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

  const verifyTransaction = async (signature: string): Promise<boolean> => {
    try {
      const status = await phantomWallet.getTransactionStatus(signature);
      console.log('Transaction status:', status);
      
      if (status && status.confirmationStatus === 'finalized') {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        await supabase.functions.invoke('log-transaction', {
          body: {
            user_id: user.id,
            meme_id: memeId,
            transaction_signature: signature,
            transaction_status: 'success',
            amount: 0.1,
          }
        });

        return true;
      }
      return false;
    } catch (error) {
      console.error('Transaction verification error:', error);
      return false;
    }
  };

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
      
      let verified = false;
      for (let i = 0; i < 30; i++) {
        verified = await verifyTransaction(signature);
        if (verified) {
          setTransactionStatus('success');
          onConfirm();
          toast({
            title: "Payment Successful",
            description: "Your meme has been featured on Tuzemoon!",
          });
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      throw new Error('Transaction verification timeout');

    } catch (error: any) {
      console.error('Payment error:', error);
      setTransactionStatus('error');
      toast({
        title: "Payment Failed",
        description: error.message || "Could not process payment",
        variant: "destructive",
      });
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tuzemoon Activation</DialogTitle>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};