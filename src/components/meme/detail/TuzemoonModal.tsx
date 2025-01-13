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
              <li>• Wallet: Phantom</li>
            </ul>
          </div>

          <Alert>
            <AlertDescription>
              <p className="font-medium mb-2">Before proceeding, please ensure:</p>
              <ul className="list-disc pl-4 space-y-1 text-sm">
                <li>Phantom Wallet is installed and unlocked</li>
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
          <Button onClick={onConfirm} disabled={isProcessing}>
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