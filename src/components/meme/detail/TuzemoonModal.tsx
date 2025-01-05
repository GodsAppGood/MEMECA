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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
    }
  }, [isOpen]);

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Temporary placeholder for payment logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      await onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Payment failed:", err);
      setError(err.message || "Payment failed. Please try again.");
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
              "Processing..."
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
