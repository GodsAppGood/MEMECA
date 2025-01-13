import { Twitter, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-4 w-full mt-auto relative">
      {/* Legal links in bottom left */}
      <div className="absolute bottom-0 p-4 w-full flex flex-row justify-between md:justify-start md:w-auto md:gap-4">
        <Link to="/privacy">
          <Button 
            variant="ghost" 
            className="transition-all duration-300 hover:bg-gray-800 hover:text-[#FFB74D] hover:scale-105 active:text-[#FFB74D] touch-action-manipulation"
          >
            Privacy Policy
          </Button>
        </Link>
        <Link to="/terms">
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
        {/* Social buttons */}
        <div className="flex justify-center gap-4 mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:text-[#FFB74D] transition-all duration-300 hover:animate-bounce-rotate group active:text-[#FFB74D] touch-action-manipulation"
          >
            <Twitter className="w-6 h-6 group-hover:animate-bounce-rotate" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:text-[#FFB74D] transition-all duration-300 hover:animate-bounce-rotate group active:text-[#FFB74D] touch-action-manipulation"
          >
            <Send className="w-6 h-6 group-hover:animate-bounce-rotate" />
          </Button>
        </div>

        {/* Copyright text */}
        <div className="text-center font-serif text-sm text-white/60">
          © 2024 MemeCatlandar.io
        </div>
      </div>
    </footer>
  );
};