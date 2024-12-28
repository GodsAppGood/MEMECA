import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ProfileDropdown } from "./ProfileDropdown";
import { AuthModal } from "../auth/AuthModal";
import { useSession } from "@/hooks/auth/useSession";
import { useState } from "react";

interface AuthSectionProps {
  isDashboardRoute: boolean;
}

export const AuthSection = ({ isDashboardRoute }: AuthSectionProps) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, handleLogout } = useSession();

  return (
    <div className="flex items-center space-x-4">
      <Link to="/submit">
        <Button
          variant="default"
          className="bg-[#FFB74D] text-black hover:bg-[#FFB74D]/90 transition-all duration-300 hover:scale-105 rounded-md shadow-[0_2px_5px_rgba(0,0,0,0.2)] hover:shadow-lg"
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
        <>
          <Button
            variant="default"
            className="bg-[#FFB74D] text-black hover:bg-[#EAA347] transition-all duration-300 hover:scale-105 rounded-md shadow-[0_2px_5px_rgba(0,0,0,0.2)] hover:shadow-lg"
            onClick={() => setIsLoginOpen(true)}
          >
            Log in
          </Button>
          <AuthModal
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
          />
        </>
      )}
    </div>
  );
};