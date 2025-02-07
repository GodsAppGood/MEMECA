
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { LoginButton } from "./LoginButton";
import { Sheet, SheetContent } from "../ui/sheet";
import { useAuthSession } from "@/hooks/auth/useAuthSession";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isLoginOpen: boolean;
  setIsLoginOpen: (isOpen: boolean) => void;
}

export const MobileMenu = ({
  isOpen,
  onClose,
  isLoginOpen,
  setIsLoginOpen,
}: MobileMenuProps) => {
  const { user, logout } = useAuthSession();
  
  const menuItems = [
    { title: "Home", path: "/" },
    { title: "Top Memes", path: "/top-memes" },
    { title: "My Story", path: "/my-story" },
    { title: "My Memes", path: "/my-memes" },
    { title: "Watchlist", path: "/watchlist" },
    { title: "Tuzemoon", path: "/tuzemoon" },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[300px] p-0">
        {/* Navigation Links */}
        <nav className="flex-1 px-6 pt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block py-4 text-xl font-medium hover:text-[#FFB74D] transition-colors"
              onClick={onClose}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="mt-auto p-6 space-y-4 border-t">
          {user ? (
            <Button
              variant="default"
              className="w-full bg-[#FFB74D] text-black hover:bg-[#FFB74D]/90 text-lg py-6"
              onClick={() => {
                logout();
                onClose();
              }}
            >
              Logout
            </Button>
          ) : (
            <LoginButton
              isLoginOpen={isLoginOpen}
              setIsLoginOpen={setIsLoginOpen}
            />
          )}
          <Link to="/submit" className="block" onClick={onClose}>
            <Button
              variant="default"
              className="w-full bg-[#FFB74D] text-black hover:bg-[#FFB74D]/90 text-lg py-6"
            >
              Submit Meme
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};
