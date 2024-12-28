import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

interface AdminNavItemProps {
  isAdmin: boolean;
}

export const AdminNavItem = ({ isAdmin }: AdminNavItemProps) => {
  if (!isAdmin) return null;

  return (
    <Link
      to="/admin"
      className="transition-all duration-300 hover:bg-[#FFB74D] hover:text-black px-3 py-2 rounded-md hover:scale-105 flex items-center gap-2"
    >
      <Shield className="h-4 w-4" />
      <span>Admin</span>
    </Link>
  );
};