import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentDetailsProps {
  memeTitle: string;
}

export const PaymentDetails = ({ memeTitle }: PaymentDetailsProps) => {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription className="text-green-600">
          Wallet connected! Ready for payment.
        </AlertDescription>
      </Alert>
      
      <div className="rounded-lg bg-secondary p-4">
        <p className="text-sm font-medium mb-2">Payment Details:</p>
        <ul className="space-y-2 text-sm">
          <li>• Amount: 0.1 SOL</li>
          <li>• Duration: 24 hours featured</li>
          <li>• Meme: {memeTitle}</li>
        </ul>
      </div>
    </div>
  );
};