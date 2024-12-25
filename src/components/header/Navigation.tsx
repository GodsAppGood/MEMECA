import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export const Navigation = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/top-memes" className="text-sm font-medium transition-colors hover:text-primary">
            Top Memes
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/my-story" className="text-sm font-medium transition-colors hover:text-primary">
            My Story
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/my-memes" className="text-sm font-medium transition-colors hover:text-primary">
            My Memes
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/watchlist" className="text-sm font-medium transition-colors hover:text-primary">
            Watchlist
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/tuzemoon" className="text-sm font-medium transition-colors hover:text-primary">
            Tuzemoon
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};