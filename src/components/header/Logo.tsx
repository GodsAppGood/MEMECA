import { useState } from "react";

export const Logo = () => {
  const [imageError, setImageError] = useState(false);

  return !imageError ? (
    <img 
      src="/lovable-uploads/c661ea44-1063-4bd5-8bff-b611ed66e4ba.png" 
      alt="Logo" 
      className="h-8 w-8 animate-float"
      onError={() => setImageError(true)}
    />
  ) : (
    <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
      <span className="text-gray-500 text-xs">Logo</span>
    </div>
  );
};