import React from 'react';
import { SubmitButton } from "../SubmitButton";

interface FormFooterProps {
  isEditing: boolean;
  isSubmitting: boolean;
}

export const FormFooter = ({ isEditing, isSubmitting }: FormFooterProps) => {
  return (
    <div className="mt-6">
      <SubmitButton isEditing={isEditing} isLoading={isSubmitting} />
    </div>
  );
};