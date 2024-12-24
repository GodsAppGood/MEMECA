import { Link } from "react-router-dom";
import { navigationLinks } from "@/config/navigationConfig";

export const Navigation = () => {
  return (
    <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
      {navigationLinks.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};