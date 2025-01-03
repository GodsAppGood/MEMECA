import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Logo } from "./header/Logo";
import { Navigation } from "./header/Navigation";
import { AuthSection } from "./header/AuthSection";
import { useHeaderAuth } from "@/hooks/useHeaderAuth";
import { MobileMenu } from "./header/MobileMenu";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";

export const Header = () => {
  const { user, isLoginOpen, setIsLoginOpen, handleLoginSuccess, handleLoginError, handleLogout } = useHeaderAuth();
  const location = useLocation();
  const isMyMemesRoute = location.pathname === '/my-memes';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="md:hidden mr-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Logo - centered on mobile */}
        <div className="flex-1 flex justify-center md:justify-start">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 ml-6">
          <Navigation />
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex flex-1 justify-end">
          <AuthSection
            user={user}
            isLoginOpen={isLoginOpen}
            setIsLoginOpen={setIsLoginOpen}
            handleLoginSuccess={handleLoginSuccess}
            handleLoginError={handleLoginError}
            handleLogout={handleLogout}
            isDashboardRoute={isMyMemesRoute}
          />
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          user={user}
          isLoginOpen={isLoginOpen}
          setIsLoginOpen={setIsLoginOpen}
          handleLoginSuccess={handleLoginSuccess}
          handleLoginError={handleLoginError}
          handleLogout={handleLogout}
        />
      </div>
    </header>
  );
};