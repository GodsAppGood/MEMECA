import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ProfileDropdown } from "./ProfileDropdown";
import { LoginButton } from "./LoginButton";

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
  return (
    <div className="flex items-center space-x-4">
      <Link to="/submit">
        <Button
          variant="default"
          className="bg-[#9b87f5] text-white hover:bg-[#7E69AB] active:bg-[#6E59A5] transition-colors"
        >
          Submit Meme
        </Button>
      </Link>
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
  );
};