import { useIsMobile } from "@/hooks/use-mobile";
import { NavigationLinks } from "./NavigationLinks";

export const Navigation = () => {
  const isMobile = useIsMobile();

  if (isMobile) return null;

  return (
    <nav className="flex items-center space-x-6 text-sm font-medium">
      <NavigationLinks />
    </nav>
  );
};