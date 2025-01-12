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
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      // Check if Phantom is installed
      if (!window.solana || !window.solana.isPhantom) {
        toast({
          title: "Wallet Not Found",
          description: "Please install Phantom Wallet to proceed with the payment",
          variant: "destructive",
        });
        window.open('https://phantom.app/', '_blank');
        return;
      }

      // Request wallet connection first
      try {
        await window.solana.connect();
      } catch (err) {
        console.error('Failed to connect wallet:', err);
        toast({
          title: "Connection Failed",
          description: "Failed to connect to Phantom wallet. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Proceed with payment
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
      setRetryCount(0);
    } catch (error: any) {
      console.error('Payment process error:', {
        error: error.message,
        memeId,
        retryCount,
        timestamp: new Date().toISOString()
      });

      const errorMessage = error.message || "Something went wrong";
      
      if (retryCount < 2) {
        setRetryCount(prev => prev + 1);
        toast({
          title: "Payment Failed - Retrying",
          description: `${errorMessage}. Attempt ${retryCount + 1} of 3...`,
          variant: "destructive",
        });
        await handlePayment();
      } else {
        toast({
          title: "Payment Failed",
          description: `${errorMessage}. Maximum retry attempts reached. Please try again later.`,
          variant: "destructive",
        });
        setRetryCount(0);
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
          setRetryCount(0);
        }}
        onConfirm={handlePayment}
        isProcessing={isProcessing}
      />
    </>
  );
};