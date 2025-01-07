import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { sendSolPayment } from "@/services/phantom-payment";
import { toast } from "@/hooks/use-toast";

interface TuzemoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  memeId: string;
  memeTitle: string;
}

export const TuzemoonModal = ({
  isOpen,
  onClose,
  onSuccess,
  memeId,
  memeTitle,
}: TuzemoonModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Initiating payment for meme:', { memeId, memeTitle });
      
      const { success, signature, error: paymentError } = await sendSolPayment(memeId, memeTitle);
      
      if (success && signature) {
        console.log('Payment successful:', signature);
        toast({
          title: "Success",
          description: "Tuzemoon activated successfully!",
        });
        await onSuccess();
        onClose();
      } else {
        console.error('Payment failed:', paymentError);
        setError(paymentError || "Transaction failed. Please try again.");
        toast({
          title: "Payment Failed",
          description: paymentError || "Transaction failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Payment process error:", err);
      const errorMessage = err.message || "Payment failed. Please try again.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">
            Confirm Tuzemoon Activation
          </DialogTitle>
          <DialogDescription className="space-y-4 pt-4">
            <p className="text-lg font-medium">You are entering a premium feature.</p>
            <div className="space-y-2 text-muted-foreground">
              <p>Your meme will receive special privileges for 24 hours.</p>
              <p>Cost: 0.1 SOL</p>
              <p>This feature supports the platform's sustainability.</p>
            </div>
            {error && (
              <p className="text-red-500 font-medium">{error}</p>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-4">
          <Button
            onClick={handlePayment}
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-5 w-5" />
                Confirm Payment
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};