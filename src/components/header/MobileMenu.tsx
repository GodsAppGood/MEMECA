import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: any | null;
  setIsLoginOpen: (isOpen: boolean) => void;
  handleLogout: () => void;
}

export const MobileMenu = ({
  isOpen,
  setIsOpen,
  user,
  setIsLoginOpen,
  handleLogout,
}: MobileMenuProps) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] sm:w-[400px] flex flex-col">
        <nav className="flex flex-col space-y-4 flex-grow">
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => handleNavigate('/top-memes')}
          >
            Top Memes
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => handleNavigate('/my-story')}
          >
            My Story
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => handleNavigate('/my-memes')}
          >
            My Memes
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => handleNavigate('/watchlist')}
          >
            Watchlist
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => handleNavigate('/tuzemoon')}
          >
            Tuzemoon
          </Button>
        </nav>
        <div className="flex flex-col space-y-4 mt-auto pt-4 border-t">
          {user ? (
            <Button
              variant="default"
              className="w-full bg-[#FFB74D] text-black hover:bg-[#FFB74D]/90"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="default"
              className="w-full bg-[#FFB74D] text-black hover:bg-[#FFB74D]/90"
              onClick={() => setIsLoginOpen(true)}
            >
              Login
            </Button>
          )}
          <Button
            variant="default"
            className="w-full bg-[#FFB74D] text-black hover:bg-[#FFB74D]/90"
            onClick={() => handleNavigate('/submit')}
          >
            Submit Meme
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};