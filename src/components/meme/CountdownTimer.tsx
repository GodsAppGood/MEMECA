import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { differenceInSeconds, format } from 'date-fns';

interface CountdownTimerProps {
  listingTime: string;
}

export const CountdownTimer = ({ listingTime }: CountdownTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const listingDate = new Date(listingTime);
      const diffInSeconds = differenceInSeconds(listingDate, now);
      
      // If more than 24 hours or past listing time, don't show timer
      if (diffInSeconds > 86400 || diffInSeconds < 0) {
        setTimeRemaining(null);
        return;
      }
      
      setTimeRemaining(diffInSeconds);
    };

    // Initial calculation
    calculateTimeRemaining();

    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [listingTime]);

  if (timeRemaining === null) {
    if (new Date(listingTime) < new Date()) {
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          Listed
        </Badge>
      );
    }
    return null;
  }

  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;

  return (
    <Badge 
      variant="outline" 
      className="bg-red-50 text-red-500 border-red-200 animate-pulse"
    >
      {`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
    </Badge>
  );
};