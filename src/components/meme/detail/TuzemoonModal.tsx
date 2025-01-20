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

  const verifyPayment = async (signature: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('verify-solana-payment', {
        body: {
          transaction_signature: signature,
          expected_amount: 0.1,
          meme_id: Number(memeId),
          user_id: user.id
        }
      });

      if (error) throw error;

      return data.success;
    } catch (error) {
      console.error('Payment verification error:', error);
      return false;
    }
  };

  const handlePayment = async () => {
    try {
      setIsPaymentProcessing(true);
      const walletAddress = await phantomWallet.getAddress();
      
      if (!walletAddress) {
        throw new Error('No wallet connected');
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      // Log initial transaction
      const { error: logError } = await supabase.functions.invoke('log-transaction', {
        body: {
          user_id: user?.id,
          meme_id: memeId,
          amount: 0.1,
          transaction_status: 'pending',
          wallet_address: walletAddress
        }
      });

      if (logError) throw logError;

      // Here we would initiate the actual Solana transaction
      // For now, we'll simulate it with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate getting transaction signature
      const mockSignature = `mock_${Date.now()}`;
      setTransactionSignature(mockSignature);

      // Verify the payment
      const isVerified = await verifyPayment(mockSignature);

      if (isVerified) {
        onConfirm();
        toast({
          title: "Payment Successful",
          description: "Your meme has been featured on Tuzemoon!",
        });
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
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
            <Button 
              onClick={handleConnectWallet} 
              className="w-full"
              variant="outline"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Connect Phantom Wallet
            </Button>
          )}

          {isWalletConnected && !isPaymentProcessing && (
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

          {isPaymentProcessing && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Processing payment...</span>
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
            disabled={isPaymentProcessing}
          >
            Cancel
          </Button>
          {isWalletConnected && !isPaymentProcessing && (
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