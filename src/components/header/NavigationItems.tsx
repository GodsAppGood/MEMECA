import { motion } from "framer-motion";
import { menuItems } from "@/config/menuConfig";

interface NavigationItemsProps {
  onNavigate: (path: string) => void;
}

export const NavigationItems = ({ onNavigate }: NavigationItemsProps) => {
  return (
    <nav className="flex flex-col gap-1 mt-6 flex-1">
      {menuItems.map((item, index) => (
        <motion.div
          key={item.path}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <button
            onClick={() => onNavigate(item.path)}
            className="w-full flex items-center px-3 py-2.5 text-base hover:bg-accent rounded-md transition-colors duration-200 hover:text-accent-foreground text-left"
          >
            {item.title}
          </button>
        </motion.div>
      ))}
    </nav>
  );
};