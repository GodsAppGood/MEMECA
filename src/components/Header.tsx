import { useState } from "react";
import { Logo } from "./header/Logo";
import { Navigation } from "./header/Navigation";
import { MobileHeader } from "./header/MobileHeader";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <MobileHeader
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
        <div className="hidden md:flex items-center space-x-6 w-full">
          <Logo />
          <Navigation />
        </div>
      </div>
    </header>
  );
};