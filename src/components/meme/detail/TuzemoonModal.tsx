import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface TuzemoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectWallet: () => void;
}

export const TuzemoonModal = ({
  isOpen,
  onClose,
  onConnectWallet,
}: TuzemoonModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Tuzemoon Activation</DialogTitle>
          <DialogDescription className="space-y-4 pt-4">
            <p className="text-lg font-medium">You have entered a premium section.</p>
            <div className="space-y-2 text-muted-foreground">
              <p>Cost: 0.1 SOL</p>
              <p>Your meme will receive exclusive privileges for 24 hours.</p>
              <p>This feature supports the platform's sustainability.</p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-4">
          <Button
            onClick={onConnectWallet}
            className="w-full"
            size="lg"
          >
            <Wallet className="mr-2 h-5 w-5" />
            Connect Phantom Wallet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};