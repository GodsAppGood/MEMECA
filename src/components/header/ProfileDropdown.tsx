import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut } from "lucide-react";

interface ProfileDropdownProps {
  user: {
    name: string;
    email: string;
    picture: string;
  };
  onLogout: () => void;
  isDashboardRoute?: boolean;
}

export const ProfileDropdown = ({ user, onLogout, isDashboardRoute }: ProfileDropdownProps) => {
  const navigate = useNavigate();
  const userInitial = user.name?.charAt(0) ?? "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-10 rounded-full"
          aria-label="Open user menu"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.picture} alt={user.name} />
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200 z-50"
        style={{ transform: 'translateX(0)' }}
      >
        <div className="flex items-center justify-start gap-2 p-2 border-b border-gray-200 bg-white">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-sm text-gray-900">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <DropdownMenuItem 
          onClick={() => navigate('/my-memes')} 
          className="cursor-pointer flex items-center p-2 hover:bg-gray-100"
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          <span>My Memes</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onLogout} 
          className="cursor-pointer flex items-center p-2 hover:bg-gray-100 text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};