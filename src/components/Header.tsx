import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useGoogleLogin } from '@react-oauth/google';
import { Home } from "lucide-react";

export const Header = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 22,
    hours: 15,
    minutes: 12,
    seconds: 0,
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const login = useGoogleLogin({
    onSuccess: (response) => {
      console.log('Login Success:', response);
      setIsLoginOpen(false);
    },
    onError: () => {
      console.log('Login Failed');
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              }
            }
          }
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-secondary/95 backdrop-blur-sm z-50">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex gap-4">
          <Link to="/">
            <Button variant="ghost" className="text-primary-foreground hover:text-primary font-serif">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
          <Link to="/story">
            <Button variant="ghost" className="text-primary-foreground hover:text-primary font-serif">
              My Story
            </Button>
          </Link>
          <Link to="/top-memes">
            <Button variant="ghost" className="text-primary-foreground hover:text-primary font-serif">
              Top Memes
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <img 
            src="/lovable-uploads/c661ea44-1063-4bd5-8bff-b611ed66e4ba.png" 
            alt="Cat Logo" 
            className="h-12 w-12 animate-float"
          />
          <div className="text-primary font-serif text-xl">
            {`${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}
          </div>
        </div>
        
        <div className="flex gap-4">
          <Link to="/submit">
            <Button className="bg-[#FF4500] hover:bg-[#FF4500]/90 font-serif">
              Submit meme
            </Button>
          </Link>
          <Button 
            className="bg-[#FF4500] hover:bg-[#FF4500]/90 font-serif"
            onClick={() => setIsLoginOpen(true)}
          >
            Log In
          </Button>
        </div>
      </nav>

      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login with Google</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <Button
              onClick={() => login()}
              className="bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                className="w-6 h-6 mr-2"
              />
              Continue with Google
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};