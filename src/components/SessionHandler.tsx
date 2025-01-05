import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const SessionHandler = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', {
        event,
        timestamp: new Date().toISOString(),
        sessionExists: !!session,
        userId: session?.user?.id,
        origin: window.location.origin,
        environment: import.meta.env.MODE,
        currentPath: window.location.pathname
      });

      if (event === 'SIGNED_IN' && session) {
        // Fetch user role information immediately after sign in
        const { data: userData, error: userError } = await supabase
          .from('Users')
          .select('is_verified, is_admin')
          .eq('auth_id', session.user.id)
          .single();
        
        if (userError) {
          console.error('Error fetching user roles:', userError);
          toast({
            title: "Error",
            description: "Failed to fetch user information. Please try refreshing the page.",
            variant: "destructive"
          });
        } else {
          console.log('User roles fetched:', userData);
        }
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
    });

    // Initial session check
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: userData, error: userError } = await supabase
          .from('Users')
          .select('is_verified, is_admin')
          .eq('auth_id', session.user.id)
          .single();
        
        if (userError) {
          console.error('Error fetching initial user roles:', userError);
        } else {
          console.log('Initial user roles fetched:', userData);
        }
      }
    };

    void checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast, navigate]);

  return null;
};