import { MobileMenu } from "./MobileMenu";

interface MobileHeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

export const MobileHeader = ({
  isMenuOpen,
  setIsMenuOpen,
}: MobileHeaderProps) => {
  return (
    <MobileMenu
      isOpen={isMenuOpen}
      setIsOpen={setIsMenuOpen}
    />
  );
};