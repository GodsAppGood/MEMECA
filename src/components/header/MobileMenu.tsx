import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { LoginButton } from "./LoginButton";
import { Sheet, SheetContent, SheetHeader } from "../ui/sheet";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  isLoginOpen: boolean;
  setIsLoginOpen: (isOpen: boolean) => void;
  handleLoginSuccess: (response: any) => void;
  handleLoginError: () => void;
  handleLogout: () => void;
}

export const MobileMenu = ({
  isOpen,
  onClose,
  user,
  isLoginOpen,
  setIsLoginOpen,
  handleLoginSuccess,
  handleLoginError,
  handleLogout,
}: MobileMenuProps) => {
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
        <SheetHeader className="p-4 border-b">
          <div className="flex justify-end">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="hover:bg-transparent"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {/* Navigation Links */}
          <nav className="flex-1 px-6">
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
          <div className="mt-auto p-6 space-y-4">
            {user ? (
              <Button
                variant="default"
                className="w-full bg-[#FFB74D] text-black hover:bg-[#FFB74D]/90 text-lg py-6"
                onClick={() => {
                  handleLogout();
                  onClose();
                }}
              >
                Logout
              </Button>
            ) : (
              <LoginButton
                isLoginOpen={isLoginOpen}
                setIsLoginOpen={setIsLoginOpen}
                handleLoginSuccess={handleLoginSuccess}
                handleLoginError={handleLoginError}
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
        </div>
      </SheetContent>
    </Sheet>
  );
};