import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { OAuthResponse } from "@supabase/supabase-js";

export const useGoogleAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "No credentials provided",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;

      // We'll handle the user data after the OAuth redirect
      // The actual user session will be available in the onAuthStateChange event
      toast({
        title: "Success!",
        description: "Redirecting to Google login...",
      });
    } catch (error: any) {
      console.error('Google login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Failed to login with Google",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleGoogleLogin,
    isLoading
  };
};