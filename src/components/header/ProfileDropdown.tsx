import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Heart, Moon } from "lucide-react";

interface ProfileDropdownProps {
  user: {
    name: string;
    email: string;
    picture: string;
  };
  onLogout: () => void;
  isDashboardRoute: boolean;
}

export const ProfileDropdown = ({ user, onLogout, isDashboardRoute }: ProfileDropdownProps) => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.picture} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-white shadow-lg border border-gray-200 fixed"
        style={{ transform: 'translateX(0)' }}
      >
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/my-memes')} className="cursor-pointer">
          <Home className="mr-2 h-4 w-4" />
          <span>My Memes</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/watchlist')} className="cursor-pointer">
          <Heart className="mr-2 h-4 w-4" />
          <span>Watchlist</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/tuzemoon')} className="cursor-pointer">
          <Moon className="mr-2 h-4 w-4" />
          <span>Tuzemoon</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};