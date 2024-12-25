import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

interface MobileHeaderProps {
  user: any | null;
  isLoginOpen: boolean;
  setIsLoginOpen: (isOpen: boolean) => void;
  handleLogout: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

export const MobileHeader = ({
  user,
  isLoginOpen,
  setIsLoginOpen,
  handleLogout,
  isMenuOpen,
  setIsMenuOpen,
}: MobileHeaderProps) => {
  return (
    <div className="md:hidden flex items-center w-full">
      <div className="flex-1" />
      <div className="flex items-center justify-center flex-1">
        <Logo />
      </div>
      <div className="flex items-center justify-end flex-1">
        <MobileMenu
          isOpen={isMenuOpen}
          setIsOpen={setIsMenuOpen}
          user={user}
          setIsLoginOpen={setIsLoginOpen}
          handleLogout={handleLogout}
        />
      </div>
    </div>
  );
};