import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { motion } from "framer-motion";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
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
      <SheetContent 
        side="left" 
        className="w-[280px] sm:w-[320px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-serif">Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 mt-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.path}
                onClick={onClose}
                className="flex items-center px-3 py-2.5 text-base hover:bg-accent rounded-md transition-colors duration-200 hover:text-accent-foreground"
              >
                {item.title}
              </Link>
            </motion.div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}