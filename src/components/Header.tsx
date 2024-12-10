import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { GoogleLogin } from "@react-oauth/google";
import { useToast } from "./ui/use-toast";

export const Header = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();

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

  const handleLoginSuccess = (credentialResponse: any) => {
    console.log('Login Success:', credentialResponse);
    
    // Store the token in localStorage
    if (credentialResponse.credential) {
      localStorage.setItem('googleToken', credentialResponse.credential);
      
      // Decode the JWT token to get user info
      try {
        const base64Url = credentialResponse.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const user = JSON.parse(jsonPayload);
        console.log('User Info:', user);
        
        toast({
          title: "Successfully logged in",
          description: `Welcome ${user.name}!`,
        });
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
          <Button
            variant="ghost"
            className="bg-[#FF4500] text-white hover:bg-[#FF4500]/90"
            onClick={() => setIsLoginOpen(true)}
          >
            Log in
          </Button>
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