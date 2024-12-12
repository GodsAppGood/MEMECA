import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { ProfileDropdown } from "./header/ProfileDropdown";
import { LoginButton } from "./header/LoginButton";
import { Countdown } from "./header/Countdown";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

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
          .select('*')
          .eq('auth_id', session.user.id)
          .single();

        if (userError && userError.code !== 'PGRST116') {
          console.error('User data fetch error:', userError);
          return;
        }

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
      console.log("Auth state changed:", event, session);
      
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

        navigate('/dashboard');
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
    const { data, error } = await supabase.auth.signInWithOAuth({
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

  const isDashboardRoute = location.pathname === '/dashboard';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-6">
          {!imageError ? (
            <img 
              src="/lovable-uploads/c661ea44-1063-4bd5-8bff-b611ed66e4ba.png" 
              alt="Logo" 
              className="h-8 w-8 animate-float"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500 text-xs">Logo</span>
            </div>
          )}
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/"
              className="transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform hover:after:origin-bottom-left hover:after:scale-x-100"
            >
              Home
            </Link>
            <Link
              to="/top-memes"
              className="transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform hover:after:origin-bottom-left hover:after:scale-x-100"
            >
              Top Memes
            </Link>
            <Link
              to="/my-story"
              className="transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform hover:after:origin-bottom-left hover:after:scale-x-100"
            >
              My Story
            </Link>
          </nav>
        </div>

        <div className="flex-1 flex justify-center">
          <Countdown />
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/submit">
            <Button
              variant="ghost"
              className="bg-[#FF4500] text-white hover:bg-[#FF4500]/90"
            >
              Submit Meme
            </Button>
          </Link>
          {user ? (
            <ProfileDropdown
              user={user}
              onLogout={handleLogout}
              isDashboardRoute={isDashboardRoute}
            />
          ) : (
            <LoginButton
              isLoginOpen={isLoginOpen}
              setIsLoginOpen={setIsLoginOpen}
              handleLoginSuccess={handleLoginSuccess}
              handleLoginError={handleLoginError}
            />
          )}
        </div>
      </div>
    </header>
  );
};