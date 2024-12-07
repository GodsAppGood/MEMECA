import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GoogleLogin } from "@react-oauth/google";

export const Header = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const countdownDate = new Date("2023-12-31T23:59:59").getTime();
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

  const handleLoginSuccess = (response: any) => {
    console.log('Login Success:', response);
    setIsLoginOpen(false);
  };

  const handleLoginError = () => {
    console.log('Login Failed');
    setIsLoginOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Meme Platform
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/submit"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Submit Meme
            </Link>
            <Link
              to="/top-memes"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Top Memes
            </Link>
            <Link
              to="/"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Home
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {!imageError ? (
            <img 
              src="/lovable-uploads/c661ea44-1063-4bd5-8bff-b611ed66e4ba.png" 
              alt="Cat Logo" 
              className="h-12 w-12 animate-float"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500 text-xs">Logo</span>
            </div>
          )}
          <div className="text-primary font-serif text-xl">
            {`${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}
          </div>
        </div>
        
        <div className="flex gap-4">
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login with Google</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-4">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
            />
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};