import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface MemeGridErrorProps {
  error: Error;
}

export const MemeGridError = ({ error }: MemeGridErrorProps) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Error loading memes. Please try again later.
      </AlertDescription>
    </Alert>
  );
};