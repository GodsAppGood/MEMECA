import { useSession } from "./auth/useSession";
import { useAuthActions } from "./auth/useAuthActions";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useHeaderAuth = () => {
  const { user, isLoading } = useSession();
  const { toast } = useToast();
  const {
    isLoginOpen,
    setIsLoginOpen,
    handleLoginSuccess,
    handleLoginError,
    handleLogout,
  } = useAuthActions();

  // Monitor auth state changes
  useEffect(() => {
    console.log('Setting up auth state listener, initial loading state:', isLoading);
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, 'Session:', session ? 'exists' : 'null');
      
      if (event === 'SIGNED_IN') {
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
      } else if (event === 'SIGNED_OUT' && !isLoading) {
        // Only show toast if it's not the initial load and there was an actual sign-out
        console.log('Sign out event detected, not initial load');
        toast({
          title: "Signed out",
          description: "You have been successfully signed out.",
        });
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Session token refreshed');
      }
    });

    // Cleanup subscription on unmount
    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [toast, isLoading]);

  return {
    user,
    isLoading,
    isLoginOpen,
    setIsLoginOpen,
    handleLoginSuccess,
    handleLoginError,
    handleLogout,
  };
};