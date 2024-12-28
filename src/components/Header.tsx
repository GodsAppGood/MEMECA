import { useLocation } from "react-router-dom";
import { Logo } from "./header/Logo";
import { Navigation } from "./header/Navigation";
import { AuthSection } from "./header/AuthSection";
import { useAuthState } from "@/hooks/useAuthState";

export const Header = () => {
  const {
    isLoginOpen,
    setIsLoginOpen,
    user,
    handleLoginSuccess,
    handleLoginError,
    handleLogout
  } = useAuthState();
  const location = useLocation();
  const isMyMemesRoute = location.pathname === '/my-memes';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center space-x-6">
          <Logo />
          <Navigation isAdmin={user?.isAdmin} />
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