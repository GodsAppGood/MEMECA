import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormWrapper } from "./FormWrapper";
import { useToast } from "@/hooks/use-toast";

interface MemeFormProps {
  onSubmitAttempt: () => void;
  isAuthenticated: boolean;
}

export const MemeForm = ({ 
  onSubmitAttempt, 
  isAuthenticated,
}: MemeFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <FormWrapper 
      onSubmitAttempt={onSubmitAttempt} 
      isAuthenticated={isAuthenticated}
    />
  );
};