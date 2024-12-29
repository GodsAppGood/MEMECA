import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Define public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/privacy",
    "/terms",
    "/my-story",
    "/top-memes",
    "/tuzemoon",
    "/watchlist",
    "/my-memes"
  ];

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

        if (!currentSession) {
          logDebug("No active session found");
          
          // Only show toast and redirect for protected routes
          if (!publicRoutes.includes(location.pathname)) {
            logDebug("Protected route accessed without authentication", location.pathname);
            toast({
              title: "Authentication Required",
              description: "Please log in to access this page.",
              variant: "destructive"
            });
            navigate("/");
          }
          return;
        }

        logDebug("Current session", currentSession);
        setSession(currentSession);

        const endTime = performance.now();
        logDebug("Auth check completed in", `${endTime - startTime}ms`);

      } catch (error: any) {
        logDebug("Auth check error", error);
        
        // Only show error toast and redirect for protected routes
        if (!publicRoutes.includes(location.pathname)) {
          toast({
            title: "Authentication Error",
            description: error.message || "Please try logging in again.",
            variant: "destructive"
          });
          navigate("/");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      logDebug("Auth state changed", event, session);
      
      if (event === 'SIGNED_OUT') {
        // Only redirect on sign out if on a protected route
        if (!publicRoutes.includes(location.pathname)) {
          logDebug("Redirecting from protected route after sign out", location.pathname);
          navigate("/");
        }
      }
      setSession(session);
    });

    // Cleanup subscription on unmount
    return () => {
      logDebug("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [navigate, toast, location.pathname]);

  return { session, isLoading };
};