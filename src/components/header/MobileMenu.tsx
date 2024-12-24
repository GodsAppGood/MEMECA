import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LoginButton } from "./LoginButton";
import { NavigationItems } from "./NavigationItems";
import { useAuthForMenu } from "@/hooks/useAuthForMenu";

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
  handleLogout: () => void;
}

export function MobileMenu({ 
  isOpen, 
  onClose,
  user,
  handleLogout,
}: MobileMenuProps) {
  const {
    isLoginOpen,
    setIsLoginOpen,
    handleLoginSuccess,
    handleLoginError,
    handleNavigation,
  } = useAuthForMenu(onClose);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="left" 
        className="w-[280px] sm:w-[320px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-serif">Menu</SheetTitle>
        </SheetHeader>
        
        <NavigationItems onNavigate={handleNavigation} />

        <div className="mt-auto pt-6 space-y-4 border-t">
          {user ? (
            <Button
              variant="default"
              className="w-full bg-[#FFB74D] text-black hover:bg-[#FFB74D]/90 transition-all duration-300 hover:scale-105"
              onClick={() => {
                onClose();
                handleNavigation('/submit');
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