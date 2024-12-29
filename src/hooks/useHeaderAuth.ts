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

  useEffect(() => {
    console.log('Setting up auth state listener, initial loading state:', isLoading);
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, 'Session:', session ? 'exists' : 'null', {
        timestamp: new Date().toISOString(),
        event,
        sessionExists: !!session,
        userId: session?.user?.id,
        origin: window.location.origin,
        environment: import.meta.env.MODE
      });
      
      if (event === 'SIGNED_IN') {
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
      } else if (event === 'SIGNED_OUT' && !isLoading) {
        console.log('Sign out event detected, not initial load');
        toast({
          title: "Signed out",
          description: "You have been successfully signed out.",
        });
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Session token refreshed successfully');
      } else if (event === 'USER_UPDATED') {
        console.log('User profile updated successfully');
      }
    });

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