import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
}: TuzemoonModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">
            Feature Unavailable
          </DialogTitle>
          <DialogDescription className="space-y-4 pt-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                The Tuzemoon feature is currently being updated. Please check back later.
              </AlertDescription>
            </Alert>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-4">
          <Button onClick={onClose} className="w-full" size="lg">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};