import { FormWrapper } from "./FormWrapper";
import { useLocation } from "react-router-dom";
import { Meme } from "@/types/meme";

interface MemeFormProps {
  onSubmitAttempt: () => void;
  isAuthenticated: boolean;
}

interface LocationState {
  editMode?: boolean;
  memeData?: Meme;
}

export const MemeForm = ({ onSubmitAttempt, isAuthenticated }: MemeFormProps) => {
  const location = useLocation();
  const { editMode, memeData } = (location.state as LocationState) || {};

  return (
    <FormWrapper 
      onSubmitAttempt={onSubmitAttempt} 
      isAuthenticated={isAuthenticated}
      editMode={editMode}
      initialData={memeData}
    />
  );
};