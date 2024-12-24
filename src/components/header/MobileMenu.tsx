import { Link, useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LoginButton } from "./LoginButton";

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  isLoginOpen: boolean;
  setIsLoginOpen: (isOpen: boolean) => void;
  handleLoginSuccess: (response: any) => void;
  handleLoginError: () => void;
  handleLogout: () => void;
}

export function MobileMenu({ 
  isOpen, 
  onClose,
  user,
  isLoginOpen,
  setIsLoginOpen,
  handleLoginSuccess,
  handleLoginError,
  handleLogout,
}: MobileMenuProps) {
  const navigate = useNavigate();
  
  const menuItems = [
    { title: "Home", path: "/" },
    { title: "Top Memes", path: "/top-memes" },
    { title: "My Story", path: "/my-story" },
    { title: "My Memes", path: "/my-memes" },
    { title: "Watchlist", path: "/watchlist" },
  ];

  const handleNavigation = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="left" 
        className="w-[280px] sm:w-[320px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-serif">Menu</SheetTitle>
        </SheetHeader>
        
        <nav className="flex flex-col gap-1 mt-6 flex-1">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => handleNavigation(item.path)}
                className="w-full flex items-center px-3 py-2.5 text-base hover:bg-accent rounded-md transition-colors duration-200 hover:text-accent-foreground text-left"
              >
                {item.title}
              </button>
            </motion.div>
          ))}
        </nav>

        <div className="mt-auto pt-6 space-y-4 border-t">
          {user ? (
            <Button
              variant="default"
              className="w-full bg-[#FFB74D] text-black hover:bg-[#FFB74D]/90 transition-all duration-300 hover:scale-105"
              onClick={() => {
                onClose();
                navigate('/submit');
              }}
            >
              Submit Meme
            </Button>
          ) : (
            <div className="space-y-4">
              <LoginButton
                isLoginOpen={isLoginOpen}
                setIsLoginOpen={setIsLoginOpen}
                handleLoginSuccess={handleLoginSuccess}
                handleLoginError={handleLoginError}
              />
              <Button
                variant="default"
                className="w-full bg-[#FFB74D] text-black hover:bg-[#FFB74D]/90 transition-all duration-300 hover:scale-105"
                onClick={() => {
                  setIsLoginOpen(true);
                  onClose();
                }}
              >
                Submit Meme
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}