import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const SessionHandler = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', {
        event,
        timestamp: new Date().toISOString(),
        sessionExists: !!session,
        userId: session?.user?.id,
        origin: window.location.origin,
        environment: import.meta.env.MODE,
        currentPath: window.location.pathname
      });

      if (event === 'TOKEN_REFRESHED') {
        console.log('Session token refreshed successfully');
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Session Ended",
          description: "Your session has ended. Please log in again to continue.",
          variant: "destructive"
        });
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast, navigate]);

  return null;
};