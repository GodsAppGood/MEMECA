import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useState, useEffect } from "react";

interface TuzemoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export const TuzemoonModal = ({
  isOpen,
  onClose,
  onSuccess,
}: TuzemoonModalProps) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setWalletConnected(false);
      setError(null);
    }
  }, [isOpen]);

  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!(window as any).solana || !(window as any).solana.isPhantom) {
        setError("Please install Phantom Wallet to proceed.");
        return;
      }

      const response = await (window as any).solana.connect();
      console.log("Wallet connected:", response.publicKey.toString());
      setWalletConnected(true);
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setError("Failed to connect wallet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Here we would normally construct and send the Solana transaction
      // This is a placeholder for demonstration
      console.log("Processing payment of 0.1 SOL");
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await onSuccess();
      onClose();
    } catch (err) {
      console.error("Transaction failed:", err);
      setError("Transaction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">
            {walletConnected 
              ? "Confirm Tuzemoon Activation" 
              : "Activate Tuzemoon for Your Meme"}
          </DialogTitle>
          <DialogDescription className="space-y-4 pt-4">
            {walletConnected ? (
              <>
                <p className="text-lg font-medium">You are entering a premium feature.</p>
                <div className="space-y-2 text-muted-foreground">
                  <p>Cost: 0.1 SOL</p>
                  <p>Your meme will receive special privileges for 24 hours.</p>
                  <p>This feature supports the platform's sustainability.</p>
                </div>
              </>
            ) : (
              <p className="text-lg">
                Connect your Phantom Wallet to enable Tuzemoon privileges for your meme.
              </p>
            )}
            {error && (
              <p className="text-red-500 font-medium">{error}</p>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-4">
          <Button
            onClick={walletConnected ? handlePayment : connectWallet}
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              "Processing..."
            ) : walletConnected ? (
              "Confirm Payment"
            ) : (
              <>
                <Wallet className="mr-2 h-5 w-5" />
                Connect Wallet
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};