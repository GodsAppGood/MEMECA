import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GoogleLogin } from "@react-oauth/google";
import { useToast } from "./ui/use-toast";
import { LogOut, LayoutDashboard, Home, Heart, Users } from "lucide-react";

interface GoogleUser {
  name: string;
  email: string;
  picture: string;
}

export const Header = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [user, setUser] = useState<GoogleUser | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const countdownDate = new Date("2024-12-22T22:22:00Z").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdownDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(interval);
      } else {
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
    console.log('Login Success:', credentialResponse);
    
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
          <div className="text-primary font-serif text-xl">
            {`${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}
          </div>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.picture} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {isDashboardRoute ? (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/my-memes')} className="cursor-pointer">
                      <Home className="mr-2 h-4 w-4" />
                      <span>My Memes</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/watchlist')} className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Watchlist</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/referral-program')} className="cursor-pointer">
                      <Users className="mr-2 h-4 w-4" />
                      <span>Referral Program</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              className="bg-[#FF4500] text-white hover:bg-[#FF4500]/90"
              onClick={() => setIsLoginOpen(true)}
            >
              Log in
            </Button>
          )}
        </div>
      </div>

      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login with Google</DialogTitle>
            <DialogDescription>
              We use Google's secure authentication to protect your data. By logging in, you agree to our{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>
              .
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4 p-4">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
              useOneTap
              theme="filled_black"
              shape="pill"
              size="large"
              text="continue_with"
              locale="en"
            />
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};
