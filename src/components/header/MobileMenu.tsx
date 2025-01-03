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
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
        <SheetHeader className="p-4 border-b">
          <div className="flex justify-end">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {/* Navigation Links */}
          <nav className="flex-1 px-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block py-4 text-lg hover:text-[#FFB74D] transition-colors"
                onClick={onClose}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="mt-auto p-4 space-y-4 border-t">
            {user ? (
              <>
                <Button
                  variant="default"
                  className="w-full bg-[#FFB74D] text-black hover:bg-[#FFB74D]/90"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
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
                className="w-full bg-[#FFB74D] text-black hover:bg-[#FFB74D]/90"
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