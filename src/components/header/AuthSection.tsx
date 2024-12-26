import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ProfileDropdown } from "./ProfileDropdown";
import { LoginButton } from "./LoginButton";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

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
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmitClick = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit memes.",
        variant: "destructive"
      });
      return;
    }
    navigate("/submit-meme");
  };

  return (
    <div className="flex items-center space-x-4">
      <Button
        variant="default"
        className="bg-[#FFB74D] text-black hover:bg-[#FFB74D]/90 transition-all duration-300 hover:scale-105 rounded-md shadow-[0_2px_5px_rgba(0,0,0,0.2)] hover:shadow-lg"
        onClick={handleSubmitClick}
      >
        Submit Meme
      </Button>
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