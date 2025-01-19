import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { phantomWallet } from "@/services/phantom-wallet";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface TuzemoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
  memeTitle: string;
}

export const TuzemoonModal = ({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
  memeTitle
}: TuzemoonModalProps) => {
  const [walletStatus, setWalletStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const { toast } = useToast();

  const handleConnectWallet = async () => {
    try {
      setWalletStatus('connecting');
      if (!phantomWallet.isPhantomInstalled) {
        toast({
          title: "Phantom Wallet Required",
          description: "Please install Phantom wallet to continue",
          variant: "destructive",
        });
        return;
      }

      const publicKey = await phantomWallet.connect();
      setWalletStatus('connected');
      toast({
        title: "Wallet Connected",
        description: `Connected with ${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`,
      });
    } catch (error) {
      console.error('Wallet connection error:', error);
      setWalletStatus('disconnected');
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Phantom wallet",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Tuzemoon Activation</DialogTitle>
          <DialogDescription>
            Feature "{memeTitle}" on the Tuzemoon page for 24 hours.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg bg-secondary p-4">
            <p className="text-sm font-medium mb-2">Payment Details:</p>
            <ul className="space-y-2 text-sm">
              <li>• Amount: 0.1 SOL</li>
              <li>• Duration: 24 hours featured placement</li>
              <li>• Meme: {memeTitle}</li>
            </ul>
          </div>

          {walletStatus === 'disconnected' && (
            <Button 
              onClick={handleConnectWallet} 
              className="w-full"
              variant="outline"
            >
              Connect Phantom Wallet
            </Button>
          )}

          {walletStatus === 'connected' && (
            <Alert>
              <AlertDescription className="text-green-600">
                Wallet connected successfully! Ready to process payment.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={isProcessing || walletStatus !== 'connected'}
            className="min-w-[140px]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Payment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};