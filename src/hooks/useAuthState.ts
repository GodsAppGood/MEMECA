import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
  isAdmin?: boolean;
}

export const useAuthState = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session check error:', error);
        return;
      }

      if (session?.user) {
        const { data: userData, error: userError } = await supabase
          .from('Users')
          .select('*, is_admin')
          .eq('auth_id', session.user.id)
          .single();

        if (userError && userError.code !== 'PGRST116') {
          console.error('Error fetching user data:', userError);
          return;
        }

        if (!userData) {
          const { error: insertError } = await supabase
            .from('Users')
            .insert([{
              auth_id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata.name || session.user.email,
              profile_image: session.user.user_metadata.picture || null,
              is_admin: false,
              email_confirmed: session.user.email_confirmed_at ? true : false
            }]);

          if (insertError) {
            console.error('Error creating user:', insertError);
            toast({
              variant: "destructive",
              title: "Error creating user profile",
              description: "Please try logging in again.",
            });
            return;
          }
        }

        setUser({
          id: session.user.id,
          name: session.user.user_metadata.name || session.user.email,
          email: session.user.email || '',
          picture: session.user.user_metadata.picture || '',
          isAdmin: userData?.is_admin || false
        });
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);
      
      if (event === 'SIGNED_IN' && session) {
        const { data: userData, error: userError } = await supabase
          .from('Users')
          .select('*, is_admin')
          .eq('auth_id', session.user.id)
          .single();

        if (userError && userError.code !== 'PGRST116') {
          console.error('Error fetching user data:', userError);
          return;
        }

        // For Google OAuth users, we consider their email as confirmed
        const isOAuthUser = session.user.app_metadata.provider === 'google';
        const emailConfirmed = isOAuthUser || session.user.email_confirmed_at !== null;

        // Update or create user record
        const userPayload = {
          auth_id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata.name || session.user.email,
          profile_image: session.user.user_metadata.picture || null,
          is_admin: userData?.is_admin || false,
          email_confirmed: emailConfirmed
        };

        if (!userData) {
          const { error: insertError } = await supabase
            .from('Users')
            .insert([userPayload]);

          if (insertError) {
            console.error('Error creating user:', insertError);
            toast({
              variant: "destructive",
              title: "Error creating user profile",
              description: "Please try logging in again.",
            });
            return;
          }
        }

        setUser({
          id: session.user.id,
          name: session.user.user_metadata.name || session.user.email,
          email: session.user.email || '',
          picture: session.user.user_metadata.picture || '',
          isAdmin: userData?.is_admin || false
        });

        const message = isOAuthUser 
          ? "Successfully logged in with Google"
          : "Successfully logged in";

        toast({
          title: "Welcome!",
          description: `${message}! Welcome ${session.user.user_metadata.name || session.user.email}!`,
        });

        navigate('/my-memes');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleLoginSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('Login error:', error);
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message,
        });
      }
    } else {
      setIsLoginOpen(false);
    }
  };

  const handleLoginError = () => {
    console.error('Login Failed');
    toast({
      variant: "destructive",
      title: "Login failed",
      description: "Please try again or contact support if the problem persists.",
    });
    setIsLoginOpen(false);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message,
      });
      return;
    }

    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  return {
    isLoginOpen,
    setIsLoginOpen,
    user,
    handleLoginSuccess,
    handleLoginError,
    handleLogout
  };
};