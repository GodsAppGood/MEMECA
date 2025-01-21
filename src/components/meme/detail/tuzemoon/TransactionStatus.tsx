import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TransactionStatusProps {
  status: 'initial' | 'confirming' | 'success' | 'error';
  signature: string | null;
}

export const TransactionStatus = ({ status, signature }: TransactionStatusProps) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center p-4 space-y-4">
        {status !== 'success' && (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        )}
        <span className="text-center">
          {status === 'confirming' ? 'Verifying transaction...' :
           status === 'success' ? 'Payment successful!' :
           status === 'error' ? 'Payment failed' : ''}
        </span>
      </div>

      {signature && (
        <Alert>
          <AlertDescription className="text-xs break-all">
            Transaction ID: {signature}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};