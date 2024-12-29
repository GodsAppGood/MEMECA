import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    "/top-memes"
  ];

  useEffect(() => {
    console.log("Checking session status...");
    
    const checkAuth = async () => {
      try {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        console.log("Session check result:", { currentSession, sessionError });

        if (sessionError) {
          console.error("Session check error:", sessionError);
          throw sessionError;
        }

        if (!currentSession) {
          console.log("No active session found");
          
          // Only show toast and redirect for protected routes
          if (!publicRoutes.includes(location.pathname)) {
            console.log(`Protected route ${location.pathname} accessed without authentication`);
            toast({
              title: "Authentication Required",
              description: "Please log in to access this page.",
              variant: "destructive"
            });
            navigate("/");
          }
          return;
        }

        console.log("Current session:", currentSession);
        setSession(currentSession);

        await ensureUserExists(currentSession);
      } catch (error: any) {
        console.error('Auth check error:', error);
        
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
          console.error('User data fetch error:', userError);
          throw userError;
        }

        if (!userData) {
          console.log('Creating new user record...');
          const { error: insertError } = await supabase
            .from('Users')
            .insert([{
              auth_id: currentSession.user.id,
              email: currentSession.user.email,
              name: currentSession.user.user_metadata?.name,
              profile_image: currentSession.user.user_metadata?.picture
            }]);

          if (insertError) {
            console.error('User creation error:', insertError);
            throw insertError;
          }
          console.log('New user record created successfully');
        }
      } catch (error) {
        console.error('Error in ensureUserExists:', error);
        throw error;
      }
    };

    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_OUT') {
        // Only redirect on sign out if on a protected route
        if (!publicRoutes.includes(location.pathname)) {
          console.log(`Redirecting from protected route ${location.pathname} after sign out`);
          navigate("/");
        }
      }
      setSession(session);
    });

    // Cleanup subscription on unmount
    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [navigate, toast, location.pathname]);

  return { session, isLoading };
};