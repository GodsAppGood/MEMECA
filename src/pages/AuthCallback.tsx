import { useEffect } from "react";
import { useMagicLink } from "@/hooks/auth/useMagicLink";

const AuthCallback = () => {
  const { handleMagicLinkCallback } = useMagicLink();

  useEffect(() => {
    handleMagicLinkCallback();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );
};

export default AuthCallback;