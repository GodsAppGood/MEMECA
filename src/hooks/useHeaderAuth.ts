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
      console.log('Auth state changed:', {
        timestamp: new Date().toISOString(),
        event,
        sessionExists: !!session,
        userId: session?.user?.id,
        origin: window.location.origin,
        environment: import.meta.env.MODE,
        currentPath: window.location.pathname,
        sessionExpiry: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : null
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

    // Set up session expiry check
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session check error:', error);
        return;
      }
      
      if (session?.expires_at) {
        const expiryTime = new Date(session.expires_at * 1000);
        const timeUntilExpiry = expiryTime.getTime() - Date.now();
        
        if (timeUntilExpiry < 300000) { // 5 minutes
          toast({
            title: "Session Expiring Soon",
            description: "Your session will expire soon. Please save your work and log in again.",
            variant: "destructive"
          });
        }
      }
    };

    const sessionCheckInterval = setInterval(checkSession, 60000); // Check every minute

    return () => {
      console.log('Cleaning up auth subscription and interval');
      subscription.unsubscribe();
      clearInterval(sessionCheckInterval);
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