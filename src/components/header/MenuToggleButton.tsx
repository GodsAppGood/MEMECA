import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MenuToggleButtonProps {
  onClick: () => void;
  className?: string;
}

export const MenuToggleButton = ({ onClick, className }: MenuToggleButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
      aria-label="Toggle menu"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
};