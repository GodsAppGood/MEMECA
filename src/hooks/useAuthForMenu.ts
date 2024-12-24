import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export const useAuthForMenu = (onClose: () => void) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLoginSuccess = async (response: any) => {
    setIsLoginOpen(false);
    onClose();
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

  const handleNavigation = (path: string) => {
    onClose();
    navigate(path);
  };

  return {
    isLoginOpen,
    setIsLoginOpen,
    handleLoginSuccess,
    handleLoginError,
    handleNavigation,
  };
};