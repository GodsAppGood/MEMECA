import { Twitter, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 md:py-4 w-full mt-auto relative">
      {/* Legal links - mobile: top row, desktop: bottom left */}
      <div className="absolute md:bottom-0 md:left-0 w-full md:w-auto p-4 flex flex-row justify-between md:justify-start md:gap-4">
        <Link to="/privacy" className="absolute md:relative left-2 top-0 md:left-auto md:top-auto">
          <Button 
            variant="ghost" 
            className="transition-all duration-300 hover:bg-gray-800 hover:text-[#FFB74D] hover:scale-105 active:text-[#FFB74D] touch-action-manipulation"
          >
            Privacy Policy
          </Button>
        </Link>
        <Link to="/terms" className="absolute md:relative right-2 top-0 md:right-auto md:top-auto">
          <Button 
            variant="ghost" 
            className="transition-all duration-300 hover:bg-gray-800 hover:text-[#FFB74D] hover:scale-105 active:text-[#FFB74D] touch-action-manipulation"
          >
            Terms of Service
          </Button>
        </Link>
      </div>

      {/* Center content */}
      <div className="container mx-auto px-4 flex flex-col items-center">
        {/* Empty space for mobile top row */}
        <div className="h-12 md:h-0" />
        
        {/* Social buttons - moved down on mobile */}
        <div className="flex justify-center gap-2 md:gap-4 mb-4 mt-8 md:mt-0">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:text-[#FFB74D] transition-all duration-300 hover:animate-bounce-rotate group active:text-[#FFB74D] touch-action-manipulation"
          >
            <Twitter className="w-6 h-6 group-hover:animate-bounce-rotate" />
          </Button>
          <a 
            href="https://t.me/Memeca_Chat" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:text-[#FFB74D] transition-all duration-300 hover:animate-bounce-rotate group active:text-[#FFB74D] touch-action-manipulation"
            >
              <Send className="w-6 h-6 group-hover:animate-bounce-rotate" />
            </Button>
          </a>
        </div>

        {/* Copyright text */}
        <div className="text-center font-serif text-sm text-white/60 mt-4 md:mt-0">
          © 2024 MemeCatlandar.io
        </div>
      </div>
    </footer>
  );
};