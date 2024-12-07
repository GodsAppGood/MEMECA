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