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
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

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

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.solana?.isPhantom) {
        try {
          if (!window.solana.isConnected) {
            const response = await window.solana.connect();
            console.log("Wallet connected:", response.publicKey.toString());
            setWalletConnected(true);
            toast({
              title: "Wallet Connected",
              description: "Your Phantom wallet is now connected",
            });
          } else {
            setWalletConnected(true);
          }
        } catch (error) {
          console.error("Failed to connect wallet:", error);
          toast({
            title: "Connection Failed",
            description: "Could not connect to Phantom wallet",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Wallet Not Found",
          description: "Please install Phantom wallet to continue",
          variant: "destructive",
        });
        window.open("https://phantom.app/", "_blank");
      }
    };

    if (isOpen) {
      checkWalletConnection();
    }
  }, [isOpen]);

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
              <li>• Wallet: Phantom {walletConnected && "✓"}</li>
            </ul>
          </div>

          <Alert>
            <AlertDescription>
              <p className="font-medium mb-2">Before proceeding, please ensure:</p>
              <ul className="list-disc pl-4 space-y-1 text-sm">
                <li className={walletConnected ? "text-green-500" : ""}>
                  Phantom Wallet is installed and unlocked
                </li>
                <li>You have sufficient SOL balance (0.1 SOL + gas fees)</li>
                <li>Your wallet is connected to the correct network (Mainnet)</li>
                <li>You understand this will feature your meme for 24 hours</li>
              </ul>
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