import { Twitter, Send } from "lucide-react";
import { Button } from "./ui/button";

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-4 w-full mt-auto relative">
      {/* Center content */}
      <div className="container mx-auto px-4 flex flex-col items-center">
        {/* Social buttons */}
        <div className="flex justify-center gap-4 mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:text-[#F5A623] transition-colors duration-300 group"
          >
            <Twitter className="w-6 h-6 group-hover:animate-bounce-rotate" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:text-[#F5A623] transition-colors duration-300 group"
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