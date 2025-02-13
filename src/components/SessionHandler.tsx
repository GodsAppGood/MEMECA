
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SessionManager } from '@/utils/auth/sessionManager';

export const SessionHandler = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const sessionManager = SessionManager.getInstance();

  useEffect(() => {
    const handleUserRoles = async (userId: string) => {
      try {
        console.log('Checking user roles:', userId);
        
        const { data: userData, error: userError } = await supabase
          .from('Users')
          .select('is_verified, is_admin, email, name, profile_image')
          .eq('auth_id', userId)
          .single();
        
        if (userError) {
          console.error('Error fetching user data:', userError);
          return null;
        }
        
        return userData;
      } catch (error) {
        console.error('Error in handleUserRoles:', error);
        return null;
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed in SessionHandler:', { 
        event, 
        userId: session?.user?.id,
        timestamp: new Date().toISOString()
      });

      if (event === 'SIGNED_IN' && session?.user?.id) {
        const userData = await handleUserRoles(session.user.id);
        
        if (!userData) {
          console.error('User data not found after login');
          await supabase.auth.signOut();
          navigate('/');
          return;
        }

        if (userData.is_admin) {
          navigate('/admin');
        }
      }

      if (event === 'SIGNED_OUT') {
        navigate('/');
      }
    });

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          await handleUserRoles(session.user.id);
        }
      } catch (error) {
        console.error('Error during initial session check:', error);
      }
    };

    void checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast, navigate]);

  return null;
};
