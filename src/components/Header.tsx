import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

export const Header = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 22,
    hours: 15,
    minutes: 12,
    seconds: 0,
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
          <Link to="/story">
            <Button variant="ghost" className="text-primary-foreground hover:text-primary">
              My Story
            </Button>
          </Link>
          <Link to="/top-memes">
            <Button variant="ghost" className="text-primary-foreground hover:text-primary">
              Top Memes
            </Button>
          </Link>
        </div>
        
        <div className="text-primary font-serif">
          {`${timeLeft.days} days ${timeLeft.hours} hours ${timeLeft.minutes} minute`}
        </div>
        
        <div className="flex gap-4">
          <Link to="/submit">
            <Button className="bg-primary hover:bg-primary/90">
              Submit meme
            </Button>
          </Link>
          <Button variant="outline" className="text-primary-foreground border-primary hover:bg-primary/10">
            Log In
          </Button>
        </div>
      </nav>
    </header>
  );
};