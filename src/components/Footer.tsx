import { Twitter, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Footer = () => {
  return (
    <footer className="bg-secondary text-primary-foreground py-4 relative">
      {/* Legal Button in bottom left */}
      <div className="absolute bottom-4 left-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="hover:text-primary">
              Legal
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <DropdownMenuGroup className="p-2 space-y-2">
              <Link to="/privacy" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  Privacy Policy
                </Button>
              </Link>
              <Link to="/terms" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  Terms of Service
                </Button>
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