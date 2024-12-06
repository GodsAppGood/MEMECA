import { Twitter, Send } from "lucide-react";
import { Button } from "./ui/button";

export const Footer = () => {
  return (
    <footer className="bg-secondary text-primary-foreground py-4">
      <div className="container mx-auto px-4 flex justify-center gap-4">
        <Button variant="ghost" size="icon" className="hover:text-primary">
          <Twitter className="w-6 h-6" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:text-primary">
          <Send className="w-6 h-6" />
        </Button>
      </div>
      <div className="text-center mt-2 font-serif text-sm text-primary-foreground/60">
        © 2024 MemeCatlandar.io
      </div>
    </footer>
  );
};