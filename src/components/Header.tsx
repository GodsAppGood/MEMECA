import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { ProfileDropdown } from "./header/ProfileDropdown";
import { LoginButton } from "./header/LoginButton";
import { Countdown } from "./header/Countdown";

interface GoogleUser {
  name: string;
  email: string;
  picture: string;
}

export const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [user, setUser] = useState<GoogleUser | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('googleToken');
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const decodedUser = JSON.parse(jsonPayload);
        setUser({
          name: decodedUser.name,
          email: decodedUser.email,
          picture: decodedUser.picture,
        });
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('googleToken');
      }
    }
  }, []);

  const handleLoginSuccess = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      localStorage.setItem('googleToken', credentialResponse.credential);
      
      try {
        const base64Url = credentialResponse.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const decodedUser = JSON.parse(jsonPayload);
        setUser({
          name: decodedUser.name,
          email: decodedUser.email,
          picture: decodedUser.picture,
        });
        
        toast({
          title: "Successfully logged in",
          description: `Welcome ${decodedUser.name}!`,
        });
        
        navigate('/dashboard');
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    
    setIsLoginOpen(false);
  };

  const handleLoginError = () => {
    console.log('Login Failed');
    toast({
      variant: "destructive",
      title: "Login failed",
      description: "Please try again or contact support if the problem persists.",
    });
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('googleToken');
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