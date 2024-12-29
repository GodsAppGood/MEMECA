import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const logDebug = (message: string, ...data: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(message, ...data);
  }
};

export const useAuthCheck = () => {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const startTime = performance.now();
        logDebug("Checking session status...");
        
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        logDebug("Session check result", currentSession, sessionError);

        if (sessionError) {
          logDebug("Session check error", sessionError);
          throw sessionError;
        }

        logDebug("Current session", currentSession);
        setSession(currentSession);

        const endTime = performance.now();
        logDebug("Auth check completed in", `${endTime - startTime}ms`);

      } catch (error: any) {
        logDebug("Auth check error", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      logDebug("Auth state changed", event, session);
      setSession(session);
    });

    return () => {
      logDebug("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [toast, location.pathname]);

  return { session, isLoading };
};