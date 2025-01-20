import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { phantomWallet } from "@/services/phantom-wallet";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

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
  const [transactionStatus, setTransactionStatus] = useState<'initial' | 'sending' | 'confirming' | 'success' | 'error'>('initial');
  const { toast } = useToast();

  const handleConnectWallet = async () => {
    if (!phantomWallet.isPhantomInstalled) {
      toast({
        title: "Phantom Wallet Required",
        description: "Please install Phantom wallet to continue",
        variant: "destructive",
      });
      return;
    }

    try {
      const publicKey = await phantomWallet.connect();
      
      if (publicKey) {
        setIsWalletConnected(true);
        toast({
          title: "Wallet Connected",
          description: `Ready to process payment of 0.1 SOL`,
        });
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      setIsWalletConnected(false);
      toast({
        title: "Connection Failed",
        description: "Could not connect to Phantom wallet",
        variant: "destructive",
      });
    }
  };

  const monitorTransaction = async (signature: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Log initial transaction status
      const { error: logError } = await supabase.functions.invoke('log-transaction', {
        body: {
          user_id: user.id,
          meme_id: memeId,
          amount: 0.1,
          transaction_status: 'confirming',
          transaction_signature: signature
        }
      });

      if (logError) console.error('Error logging transaction:', logError);

      // Start verification process
      const { data, error } = await supabase.functions.invoke('verify-solana-payment', {
        body: {
          transaction_signature: signature,
          expected_amount: 0.1,
          meme_id: Number(memeId),
          user_id: user.id
        }
      });

      if (error) throw error;

      if (data.success) {
        setTransactionStatus('success');
        onConfirm();
        toast({
          title: "Payment Successful",
          description: "Your meme has been featured on Tuzemoon!",
        });
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error: any) {
      console.error('Transaction monitoring error:', error);
      setTransactionStatus('error');
      toast({
        title: "Payment Failed",
        description: error.message || "Could not verify payment",
        variant: "destructive",
      });
    }
  };

  const handlePayment = async () => {
    try {
      setIsPaymentProcessing(true);
      setTransactionStatus('sending');
      
      const walletAddress = await phantomWallet.getAddress();
      if (!walletAddress) throw new Error('No wallet connected');

      // Get the recipient's public key
      const { data: { TUZEMOON_WALLET_ADDRESS } } = await supabase.functions.invoke('get-tuzemoon-wallet');
      if (!TUZEMOON_WALLET_ADDRESS) throw new Error('Recipient wallet not configured');

      const recipientPubKey = new PublicKey(TUZEMOON_WALLET_ADDRESS);
      const amount = 0.1 * LAMPORTS_PER_SOL;

      // Create and send transaction immediately
      const transaction = await phantomWallet.createTransferTransaction(
        recipientPubKey,
        amount
      );

      const signature = await phantomWallet.signAndSendTransaction(transaction);
      setTransactionSignature(signature);
      setTransactionStatus('confirming');

      // Start monitoring in background
      monitorTransaction(signature);

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

  const getStatusMessage = () => {
    switch (transactionStatus) {
      case 'sending':
        return 'Initiating payment...';
      case 'confirming':
        return 'Confirming transaction...';
      case 'success':
        return 'Payment successful!';
      case 'error':
        return 'Payment failed';
      default:
        return '';
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
            <Button 
              onClick={handleConnectWallet} 
              className="w-full"
              variant="outline"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Connect Phantom Wallet
            </Button>
          )}

          {isWalletConnected && !isPaymentProcessing && transactionStatus === 'initial' && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription className="text-green-600">
                  Wallet connected! Ready for payment.
                </AlertDescription>
              </Alert>
              
              <div className="rounded-lg bg-secondary p-4">
                <p className="text-sm font-medium mb-2">Payment Details:</p>
                <ul className="space-y-2 text-sm">
                  <li>• Amount: 0.1 SOL</li>
                  <li>• Duration: 24 hours featured</li>
                  <li>• Meme: {memeTitle}</li>
                </ul>
              </div>
            </div>
          )}

          {(isPaymentProcessing || transactionStatus !== 'initial') && (
            <div className="flex flex-col items-center justify-center p-4 space-y-4">
              {transactionStatus !== 'success' && (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              )}
              <span className="text-center">{getStatusMessage()}</span>
            </div>
          )}

          {transactionSignature && (
            <Alert>
              <AlertDescription className="text-xs break-all">
                Transaction ID: {transactionSignature}
              </AlertDescription>
            </Alert>
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