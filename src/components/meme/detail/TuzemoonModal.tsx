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
import { useState, useEffect } from "react";
import { connectWallet } from "@/services/phantom-wallet";

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
  const [walletConnected, setWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check wallet connection status on mount and when window.solana changes
  useEffect(() => {
    const checkWalletConnection = () => {
      if (window.solana?.isPhantom && window.solana.isConnected) {
        setWalletConnected(true);
      } else {
        setWalletConnected(false);
      }
    };

    checkWalletConnection();
    window.addEventListener('load', checkWalletConnection);

    return () => {
      window.removeEventListener('load', checkWalletConnection);
    };
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const response = await connectWallet();
      if (response.success) {
        setWalletConnected(true);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
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
              <li>• Network: Solana (Mainnet)</li>
              <li>• Gas Fee: ~0.000005 SOL</li>
              <li>• Duration: 24 hours featured placement</li>
              <li>• Meme: {memeTitle}</li>
            </ul>
          </div>

          <Alert>
            <AlertDescription>
              {!walletConnected ? (
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-normal text-sm text-blue-500"
                    onClick={handleConnect}
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      'Connect Phantom Wallet'
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-600">
                  <Wallet className="h-4 w-4" />
                  <span>✓ Wallet Connected</span>
                </div>
              )}
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={isProcessing || !walletConnected}
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