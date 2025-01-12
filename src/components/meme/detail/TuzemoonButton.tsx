import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendSolPayment } from "@/services/phantom-payment";
import { TuzemoonModal } from "./TuzemoonModal";
import { supabase } from "@/integrations/supabase/client";

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

  const handleAdminTuzemoon = async () => {
    setIsProcessing(true);
    try {
      console.log('Admin updating Tuzemoon status for meme:', memeId);
      
      const tuzemoonUntil = !isFeatured ? 
        new Date(Date.now() + 24 * 60 * 60 * 1000) : // 24 hours from now
        null;

      const { error } = await supabase
        .from('Memes')
        .update({ 
          is_featured: !isFeatured,
          tuzemoon_until: tuzemoonUntil
        })
        .eq('id', memeId);

      if (error) throw error;

      await onUpdate();
      
      toast({
        title: !isFeatured ? "Tuzemoon Activated" : "Tuzemoon Deactivated",
        description: `Successfully ${!isFeatured ? 'added to' : 'removed from'} Tuzemoon`,
      });

    } catch (error: any) {
      console.error('Admin Tuzemoon update error:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update Tuzemoon status",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

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

      // Connect to wallet first
      try {
        console.log('Connecting to Phantom wallet...');
        const response = await window.solana.connect();
        console.log('Wallet connected:', response.publicKey.toString());
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
      console.log('Starting payment process...');
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

  const handleClick = () => {
    if (isAdmin) {
      handleAdminTuzemoon();
    } else {
      setIsModalOpen(true);
    }
  };

  if (!isVerified && !isAdmin) {
    return null;
  }

  return (
    <>
      <Button
        onClick={handleClick}
        variant={isFeatured ? "secondary" : "default"}
        className="flex items-center gap-2"
        disabled={isProcessing}
      >
        <Rocket className="h-4 w-4" />
        {isFeatured ? "Featured" : "Tuzemoon"}
      </Button>

      {!isAdmin && (
        <TuzemoonModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setRetryCount(0);
          }}
          onConfirm={handlePayment}
          isProcessing={isProcessing}
        />
      )}
    </>
  );
};