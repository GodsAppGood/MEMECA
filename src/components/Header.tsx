import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "./header/Logo";
import { Navigation } from "./header/Navigation";
import { AuthSection } from "./header/AuthSection";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";
import { NavigationLinks } from "./header/NavigationLinks";

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const isMyMemesRoute = location.pathname === '/my-memes';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {isMobile ? (
          <>
            <div className="flex-1" />
            <div className="flex items-center justify-center flex-1">
              <Logo />
            </div>
            <div className="flex items-center justify-end flex-1">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[300px] sm:w-[400px] flex flex-col">
                  <nav className="flex flex-col space-y-4 flex-grow">
                    <NavigationLinks onClickMobile={() => setIsMenuOpen(false)} />
                  </nav>
                  <div className="flex flex-col space-y-4 mt-auto pt-4 border-t">
                    {user ? (
                      <Button
                        variant="default"
                        className="w-full bg-[#FFB74D] text-black hover:bg-[#FFB74D]/90"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        className="w-full bg-[#FFB74D] text-black hover:bg-[#FFB74D]/90"
                        onClick={() => setIsLoginOpen(true)}
                      >
                        Login
                      </Button>
                    )}
                    <Button
                      variant="default"
                      className="w-full bg-[#FFB74D] text-black hover:bg-[#FFB74D]/90"
                      onClick={() => handleNavigate('/submit')}
                    >
                      Submit Meme
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-6">
              <Logo />
              <Navigation />
            </div>
            <div className="flex-1 flex justify-end">
              <AuthSection
                user={user}
                isLoginOpen={isLoginOpen}
                setIsLoginOpen={setIsLoginOpen}
                handleLoginSuccess={handleLoginSuccess}
                handleLoginError={handleLoginError}
                handleLogout={handleLogout}
                isDashboardRoute={isMyMemesRoute}
              />
            </div>
          </>
        )}
      </div>
    </header>
  );
};