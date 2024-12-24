import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Logo } from "./header/Logo";
import { Navigation } from "./header/Navigation";
import { AuthSection } from "./header/AuthSection";
import { MenuToggleButton } from "./header/MenuToggleButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileMenu } from "./header/MobileMenu";
import { useAuth } from "@/hooks/useAuth";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const {
    user,
    isLoginOpen,
    setIsLoginOpen,
    handleLoginSuccess,
    handleLoginError,
    handleLogout
  } = useAuth();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        {isMobile ? (
          <>
            <MenuToggleButton
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1"
            />
            <div className="flex-1 flex justify-center">
              <Logo />
            </div>
            <div className="w-8" />
          </>
        ) : (
          <>
            <Logo />
            <Navigation />
            <AuthSection
              user={user}
              isLoginOpen={isLoginOpen}
              setIsLoginOpen={setIsLoginOpen}
              handleLoginSuccess={handleLoginSuccess}
              handleLoginError={handleLoginError}
              handleLogout={handleLogout}
              isDashboardRoute={location.pathname === '/my-memes'}
            />
          </>
        )}
      </div>
      
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        handleLogout={handleLogout}
      />
    </header>
  );
};