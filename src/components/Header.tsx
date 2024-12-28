import { useLocation } from "react-router-dom";
import { Logo } from "./header/Logo";
import { Navigation } from "./header/Navigation";
import { AuthSection } from "./header/AuthSection";
import { useSession } from "@/hooks/auth/useSession";

export const Header = () => {
  const { user } = useSession();
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
          <AuthSection isDashboardRoute={isMyMemesRoute} />
        </div>
      </div>
    </header>
  );
};