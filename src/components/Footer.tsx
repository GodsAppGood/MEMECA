import { Twitter, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-4 w-full mt-auto relative">
      {/* Legal Button in bottom left */}
      <div className="absolute left-0 bottom-0 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="hover:text-primary transition-all duration-200 hover:scale-105"
            >
              Legal
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-40 bg-black border border-gray-800"
            side="top"
            align="start"
          >
            <DropdownMenuGroup className="p-2 space-y-2">
              <Link to="/privacy" className="block">
                <DropdownMenuItem className="cursor-pointer text-white hover:text-primary transition-all duration-200 hover:scale-105">
                  Privacy Policy
                </DropdownMenuItem>
              </Link>
              <Link to="/terms" className="block">
                <DropdownMenuItem className="cursor-pointer text-white hover:text-primary transition-all duration-200 hover:scale-105">
                  Terms of Service
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Center content */}
      <div className="container mx-auto px-4 flex flex-col items-center">
        {/* Social buttons */}
        <div className="flex justify-center gap-4 mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:text-primary transition-all duration-200 hover:scale-105"
          >
            <Twitter className="w-6 h-6" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:text-primary transition-all duration-200 hover:scale-105"
          >
            <Send className="w-6 h-6" />
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