import { FormWrapper } from "./FormWrapper";

interface MemeFormProps {
  onSubmitAttempt: () => void;
  isAuthenticated: boolean;
}

export const MemeForm = ({ onSubmitAttempt, isAuthenticated }: MemeFormProps) => {
  return <FormWrapper onSubmitAttempt={onSubmitAttempt} isAuthenticated={isAuthenticated} />;
};