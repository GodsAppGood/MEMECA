import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorStateProps {
  error?: Error | { status?: number; message?: string } | null;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({ error, message }: ErrorStateProps) => {
  const getErrorMessage = () => {
    if (message) return message;
    if (!error) return 'An unexpected error occurred';
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    return error.message || 'An unexpected error occurred';
  };

  const getErrorStatus = () => {
    if (!error || error instanceof Error) return null;
    return error.status;
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Alert variant="destructive" className="max-w-lg">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="space-y-2">
          {getErrorStatus() && (
            <p className="text-sm font-medium">Status: {getErrorStatus()}</p>
          )}
          <p>{getErrorMessage()}</p>
        </AlertDescription>
      </Alert>
    </div>
  );
};