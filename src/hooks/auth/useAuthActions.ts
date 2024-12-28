import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useAuthActions = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLoginSuccess = async () => {
    try {
      // Log the redirect URI for debugging
      console.log('Supabase redirect URI:', `${window.location.origin}/auth/v1/callback`);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) {
        console.error('Login error:', error);
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message,
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "An unexpected error occurred",
      });
    }
    
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
    try {
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
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message || "An unexpected error occurred",
      });
    }
  };

  return {
    isLoginOpen,
    setIsLoginOpen,
    handleLoginSuccess,
    handleLoginError,
    handleLogout,
  };
};