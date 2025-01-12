import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { connectPhantomWallet } from "@/utils/phantom-wallet";
import { sendSolPayment } from "@/services/phantom-payment";
import { TuzemoonModal } from "./TuzemoonModal";

interface TuzemoonButtonProps {
  memeId: string;
  memeTitle: string;
  isFeatured: boolean;
  isAdmin: boolean;
  isVerified: boolean;
  onUpdate: () => Promise<any>;
}

export const TuzemoonButton = ({
  memeId,
  memeTitle,
  isFeatured,
  isAdmin,
  isVerified,
  onUpdate
}: TuzemoonButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      console.log('Starting payment process:', {
        memeId,
        memeTitle,
        timestamp: new Date().toISOString()
      });

      // First check if Phantom is installed
      if (!window.solana || !window.solana.isPhantom) {
        toast({
          title: "Wallet Not Found",
          description: "Please install Phantom Wallet to proceed with the payment",
          variant: "destructive",
        });
        window.open('https://phantom.app/', '_blank');
        return;
      }

      // Connect wallet first
      const walletAddress = await connectPhantomWallet();
      console.log('Wallet connection attempt:', { walletAddress });
      
      if (!walletAddress) {
        throw new Error("Failed to connect wallet");
      }

      // Process payment
      const { success, signature, error } = await sendSolPayment(memeId, memeTitle);

      if (!success || !signature) {
        throw new Error(error || "Payment failed");
      }

      console.log('Payment successful:', {
        signature,
        memeId,
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Payment Successful",
        description: `Your transaction has been confirmed. Signature: ${signature.slice(0, 8)}...`,
      });

      setIsModalOpen(false);
      await onUpdate();
      setRetryCount(0); // Reset retry count on success
    } catch (error: any) {
      console.error('Payment process error:', {
        error: error.message,
        memeId,
        retryCount,
        timestamp: new Date().toISOString()
      });

      const errorMessage = error.message || "Something went wrong";
      
      if (retryCount < 2) { // Max 3 attempts (0, 1, 2)
        setRetryCount(prev => prev + 1);
        toast({
          title: "Payment Failed - Retrying",
          description: `${errorMessage}. Attempt ${retryCount + 1} of 3...`,
          variant: "destructive",
        });
        handlePayment(); // Retry
      } else {
        toast({
          title: "Payment Failed",
          description: `${errorMessage}. Maximum retry attempts reached. Please try again later.`,
          variant: "destructive",
        });
        setRetryCount(0); // Reset retry count
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isVerified && !isAdmin) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant={isFeatured ? "secondary" : "default"}
        className="flex items-center gap-2"
        disabled={isProcessing}
      >
        <Rocket className="h-4 w-4" />
        {isFeatured ? "Featured" : "Tuzemoon"}
      </Button>

      <TuzemoonModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setRetryCount(0); // Reset retry count when modal is closed
        }}
        onConfirm={handlePayment}
        isProcessing={isProcessing}
      />
    </>
  );
};