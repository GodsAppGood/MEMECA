import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface ErrorStateProps {
  error?: Error | null;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({ error, message, onRetry }: ErrorStateProps) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Alert variant="destructive" className="max-w-lg">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {message || error?.message || 'An unexpected error occurred'}
        </AlertDescription>
        {onRetry && (
          <Button
            variant="outline"
            className="mt-4"
            onClick={onRetry}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        )}
      </Alert>
    </div>
  );
};