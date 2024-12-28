import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "./header/Logo";
import { Navigation } from "./header/Navigation";
import { AuthSection } from "./header/AuthSection";
import { useHeaderAuth } from "@/hooks/useHeaderAuth";

export const Header = () => {
  const { user, isLoginOpen, setIsLoginOpen, handleLoginSuccess, handleLoginError, handleLogout } = useHeaderAuth();
  const location = useLocation();
  const isMyMemesRoute = location.pathname === '/my-memes';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center space-x-6">
          <Logo />
          <Navigation />
        </div>

        <div className="flex-1 flex justify-end">
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
      </div>
    </header>
  );
};