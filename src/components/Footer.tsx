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
    <footer className="bg-secondary text-primary-foreground py-4 relative w-full bottom-0">
      {/* Legal Button in bottom left */}
      <div className="absolute bottom-4 left-4 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="hover:text-primary">
              Legal
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-40 bg-secondary border border-gray-200"
            side="top"
            align="start"
          >
            <DropdownMenuGroup className="p-2 space-y-2">
              <Link to="/privacy" className="block">
                <DropdownMenuItem className="cursor-pointer text-primary-foreground hover:text-primary">
                  Privacy Policy
                </DropdownMenuItem>
              </Link>
              <Link to="/terms" className="block">
                <DropdownMenuItem className="cursor-pointer text-primary-foreground hover:text-primary">
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
          <Button variant="ghost" size="icon" className="hover:text-primary">
            <Twitter className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:text-primary">
            <Send className="w-6 h-6" />
          </Button>
        </div>

        {/* Copyright text */}
        <div className="text-center font-serif text-sm text-primary-foreground/60">
          © 2024 MemeCatlandar.io
        </div>
      </div>
    </footer>
  );
};