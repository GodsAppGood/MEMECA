import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ProfileDropdown } from "./ProfileDropdown";
import { LoginButton } from "./LoginButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { Plus } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

interface AuthSectionProps {
  user: User | null;
  isLoginOpen: boolean;
  setIsLoginOpen: (isOpen: boolean) => void;
  handleLoginSuccess: (response: any) => void;
  handleLoginError: () => void;
  handleLogout: () => void;
  isDashboardRoute: boolean;
}

export const AuthSection = ({
  user,
  isLoginOpen,
  setIsLoginOpen,
  handleLoginSuccess,
  handleLoginError,
  handleLogout,
  isDashboardRoute
}: AuthSectionProps) => {
  const isMobile = useIsMobile();

  return (
    <>
      <div className="flex items-center space-x-2 md:space-x-4">
        {!isMobile && (
          <Link to="/submit">
            <Button
              variant="default"
              className="bg-[#FFB74D] text-black hover:bg-[#FFB74D]/90 transition-all duration-300 hover:scale-105 rounded-md shadow-[0_2px_5px_rgba(0,0,0,0.2)] hover:shadow-lg text-sm"
            >
              Submit Meme
            </Button>
          </Link>
        )}
        {user ? (
          <ProfileDropdown
            user={user}
            onLogout={handleLogout}
            isDashboardRoute={isDashboardRoute}
          />
        ) : (
          <LoginButton
            isLoginOpen={isLoginOpen}
            setIsLoginOpen={setIsLoginOpen}
            handleLoginSuccess={handleLoginSuccess}
            handleLoginError={handleLoginError}
          />
        )}
      </div>
      
      {isMobile && (
        <Link to="/submit">
          <Button
            variant="default"
            size="icon"
            className="fixed bottom-4 right-4 z-50 bg-[#FFB74D] text-black hover:bg-[#FFB74D]/90 transition-all duration-300 hover:scale-105 rounded-full w-12 h-12 shadow-lg animate-bounce-rotate"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </Link>
      )}
    </>
  );
};