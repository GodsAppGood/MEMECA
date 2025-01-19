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

const WalletStatus = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
} as const;

const PaymentStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  READY: 'ready',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

type WalletStatusType = typeof WalletStatus[keyof typeof WalletStatus];
type PaymentStatusType = typeof PaymentStatus[keyof typeof PaymentStatus];

export const TuzemoonModal = ({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
  memeTitle,
  memeId
}: TuzemoonModalProps) => {
  const [walletStatus, setWalletStatus] = useState<WalletStatusType>(WalletStatus.DISCONNECTED);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusType>(PaymentStatus.PENDING);
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
      setWalletStatus(WalletStatus.CONNECTING);
      const publicKey = await phantomWallet.connect();
      
      if (publicKey) {
        setWalletStatus(WalletStatus.CONNECTED);
        setPaymentStatus(PaymentStatus.READY);
        toast({
          title: "Wallet Connected",
          description: `Ready to process payment of 0.1 SOL`,
        });
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      setWalletStatus(WalletStatus.DISCONNECTED);
      toast({
        title: "Connection Failed",
        description: "Could not connect to Phantom wallet",
        variant: "destructive",
      });
    }
  };

  const handlePayment = async () => {
    try {
      setPaymentStatus(PaymentStatus.PROCESSING);
      const walletAddress = await phantomWallet.getAddress();
      
      if (!walletAddress) {
        throw new Error('No wallet connected');
      }

      const { data: { user } } = await supabase.auth.getUser();
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

      setPaymentStatus(PaymentStatus.SUCCESS);
      onConfirm();
      
      toast({
        title: "Payment Successful",
        description: "Your meme has been featured on Tuzemoon!",
      });
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStatus(PaymentStatus.ERROR);
      toast({
        title: "Payment Failed",
        description: error.message || "Could not process payment",
        variant: "destructive",
      });
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
          {walletStatus === WalletStatus.DISCONNECTED && (
            <Button 
              onClick={handleConnectWallet} 
              className="w-full"
              variant="outline"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Connect Phantom Wallet
            </Button>
          )}

          {walletStatus === WalletStatus.CONNECTED && paymentStatus === PaymentStatus.READY && (
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

          {paymentStatus === PaymentStatus.PROCESSING && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Processing payment...</span>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={paymentStatus === PaymentStatus.PROCESSING}
          >
            Cancel
          </Button>
          {walletStatus === WalletStatus.CONNECTED && paymentStatus === PaymentStatus.READY && (
            <Button 
              onClick={handlePayment}
              disabled={paymentStatus === PaymentStatus.PROCESSING}
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