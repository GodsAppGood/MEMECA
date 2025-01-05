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
        console.log('Fetching user roles for:', userId);
        
        const { data: userData, error: userError } = await supabase
          .from('Users')
          .select('is_verified, is_admin, email, name, profile_image')
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
        
        console.log('User data fetched:', userData);
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
          currentPath: window.location.pathname,
          userMetadata: session?.user?.user_metadata
        });

        if (event === 'SIGNED_IN' && session?.user?.id) {
          const userData = await handleUserRoles(session.user.id);
          
          if (!userData) {
            console.error('No user data found after sign in');
            toast({
              title: "Error",
              description: "Failed to load user profile. Please try logging in again.",
              variant: "destructive"
            });
            await supabase.auth.signOut();
            navigate('/');
            return;
          }

          // Verify session is properly established
          const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError || !currentSession) {
            console.error('Session verification failed:', sessionError);
            toast({
              title: "Session Error",
              description: "Failed to establish session. Please try logging in again.",
              variant: "destructive"
            });
            return;
          }

          console.log('Session successfully established:', {
            userId: currentSession.user.id,
            isAdmin: userData.is_admin,
            isVerified: userData.is_verified
          });

          toast({
            title: "Welcome back!",
            description: `Signed in as ${userData.email}`,
          });

          // Redirect admin users to admin dashboard
          if (userData.is_admin) {
            navigate('/admin');
          } else {
            navigate('/');
          }

        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Session token refreshed successfully');
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          toast({
            title: "Session Ended",
            description: "Your session has ended. Please log in again to continue.",
            variant: "destructive"
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Error in auth state change handler:', error);
        toast({
          title: "Authentication Error",
          description: "There was a problem with authentication. Please try again.",
          variant: "destructive"
        });
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