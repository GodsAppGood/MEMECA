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
import { useState } from "react";
import { connectWallet } from "@/services/phantom-wallet";

interface TuzemoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
}

export const TuzemoonModal = ({
  isOpen,
  onClose,
  onConfirm,
  isProcessing
}: TuzemoonModalProps) => {
  const [walletConnected, setWalletConnected] = useState(false);

  const handleConnect = async () => {
    const response = await connectWallet();
    if (response.success) {
      setWalletConnected(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Tuzemoon Payment</DialogTitle>
          <DialogDescription>
            Feature your meme on the Tuzemoon page by completing a payment of 0.1 SOL.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg bg-secondary p-4">
            <p className="text-sm font-medium mb-2">Payment Details:</p>
            <ul className="space-y-2 text-sm">
              <li>• Amount: 0.1 SOL</li>
              <li>• Network: Solana (Mainnet)</li>
              <li>• Duration: 24 hours featured placement</li>
            </ul>
          </div>

          <Alert>
            <AlertDescription>
              <p className="text-sm">
                {!walletConnected ? (
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-normal text-sm text-blue-500"
                    onClick={handleConnect}
                  >
                    Connect Phantom Wallet
                  </Button>
                ) : (
                  "✓ Wallet Connected"
                )}
              </p>
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