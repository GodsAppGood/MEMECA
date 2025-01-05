import React from 'react';

interface FormHeaderProps {
  isEditing: boolean;
}

export const FormHeader = ({ isEditing }: FormHeaderProps) => {
  return (
    <h2 className="text-3xl font-serif text-center mb-8">
      {isEditing ? "Edit Your Meme" : "Submit Your Meme"}
    </h2>
  );
};