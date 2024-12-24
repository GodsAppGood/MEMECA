import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "./header/Logo";
import { Navigation } from "./header/Navigation";
import { AuthSection } from "./header/AuthSection";
import { MenuToggleButton } from "./header/MenuToggleButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileMenu } from "./header/MobileMenu";
import { Support } from "./Support";

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session check error:', error);
        return;
      }

      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.name,
          email: session.user.email || '',
          picture: session.user.user_metadata.picture
        });
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.name,
          email: session.user.email || '',
          picture: session.user.user_metadata.picture
        });

        toast({
          title: "Successfully logged in",
          description: `Welcome ${session.user.user_metadata.name}!`,
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
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
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
    
    setIsLoginOpen(false);
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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        {isMobile ? (
          <>
            <MenuToggleButton
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1"
            />
            <div className="flex-1 flex justify-center">
              <Logo />
            </div>
            <div className="w-8" />
          </>
        ) : (
          <>
            <Logo />
            <Navigation />
            <AuthSection
              user={user}
              isLoginOpen={isLoginOpen}
              setIsLoginOpen={setIsLoginOpen}
              handleLoginSuccess={handleLoginSuccess}
              handleLoginError={handleLoginError}
              handleLogout={handleLogout}
              isDashboardRoute={location.pathname === '/my-memes'}
            />
          </>
        )}
      </div>
      
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        handleLogout={handleLogout}
      />
    </header>
  );
};
