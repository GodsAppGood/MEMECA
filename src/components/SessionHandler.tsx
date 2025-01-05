import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const SessionHandler = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleUserRoles = async (userId: string) => {
      try {
        const { data: userData, error: userError } = await supabase
          .from('Users')
          .select('is_verified, is_admin')
          .eq('auth_id', userId)
          .single();
        
        if (userError) {
          console.error('Error fetching user roles:', userError);
          toast({
            title: "Error",
            description: "Failed to fetch user information. Please try refreshing the page.",
            variant: "destructive"
          });
          return null;
        }
        
        console.log('User roles fetched:', userData);
        return userData;
      } catch (error) {
        console.error('Error in handleUserRoles:', error);
        return null;
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        console.log('Auth state change:', {
          event,
          timestamp: new Date().toISOString(),
          sessionExists: !!session,
          userId: session?.user?.id,
          origin: window.location.origin,
          environment: import.meta.env.MODE,
          currentPath: window.location.pathname
        });

        if (event === 'SIGNED_IN' && session?.user?.id) {
          await handleUserRoles(session.user.id);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Session token refreshed successfully');
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Session Ended",
            description: "Your session has ended. Please log in again to continue.",
            variant: "destructive"
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Error in auth state change handler:', error);
      }
    });

    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          await handleUserRoles(session.user.id);
        }
      } catch (error) {
        console.error('Error in initial session check:', error);
      }
    };

    void checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast, navigate]);

  return null;
};