import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useGoogleAuth } from "./useGoogleAuth";
import { useMagicLink } from "./useMagicLink";
import { useSession } from "./useSession";

export const useAuthState = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleGoogleLogin } = useGoogleAuth();
  const { sendMagicLink, handleMagicLinkCallback } = useMagicLink();
  const { user } = useSession();

  const handleLoginSuccess = async (response: any) => {
    await handleGoogleLogin(response);
    setIsLoginOpen(false);
  };

  const handleLoginError = () => {
    console.error('Login Failed');
    toast({
      variant: "destructive",
      title: "Login failed",
      description: "Please try again or contact support if the problem persists.",
    });
    setIsLoginOpen(false);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  return {
    isLoginOpen,
    setIsLoginOpen,
    user,
    handleLoginSuccess,
    handleLoginError,
    handleLogout,
    sendMagicLink,
    handleMagicLinkCallback
  };
};