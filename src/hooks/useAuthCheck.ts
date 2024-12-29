import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const logDebug = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(message, data);
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
        logDebug("Checking session status...");
        
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        logDebug("Session check result", { currentSession, sessionError });

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

        await ensureUserExists(currentSession);
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

    const ensureUserExists = async (currentSession: any) => {
      try {
        const { data: userData, error: userError } = await supabase
          .from('Users')
          .select('*')
          .eq('auth_id', currentSession.user.id)
          .single();

        if (userError && userError.code !== 'PGRST116') {
          logDebug("User data fetch error", userError);
          throw userError;
        }

        if (!userData) {
          logDebug("Creating new user record");
          const { error: insertError } = await supabase
            .from('Users')
            .insert([{
              auth_id: currentSession.user.id,
              email: currentSession.user.email,
              name: currentSession.user.user_metadata?.name,
              profile_image: currentSession.user.user_metadata?.picture
            }]);

          if (insertError) {
            logDebug("User creation error", insertError);
            throw insertError;
          }
          logDebug("New user record created successfully");
        }
      } catch (error) {
        logDebug("Error in ensureUserExists", error);
        throw error;
      }
    };

    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      logDebug("Auth state changed", { event, session });
      
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