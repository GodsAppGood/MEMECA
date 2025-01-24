import { CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TransactionStatusProps {
  status: 'initial' | 'confirming' | 'success' | 'error';
  signature: string | null;
}

export const TransactionStatus = ({ status, signature }: TransactionStatusProps) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center p-4 space-y-4">
        {status === 'confirming' && (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        )}
        {status === 'success' && (
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        )}
        <span className="text-center font-medium">
          {status === 'confirming' ? 'Confirming transaction...' :
           status === 'success' ? 'Payment successful!' :
           status === 'error' ? 'Payment error' : ''}
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