import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const Navigation = () => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <div className="relative w-full">
        {/* Gradient indicators for scroll */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background/80 to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background/80 to-transparent pointer-events-none z-10" />
        
        {/* Scrollable navigation */}
        <nav className="flex items-center space-x-6 overflow-x-auto scrollbar-hide px-4 py-2 scroll-smooth">
          <NavigationLink to="/">Home</NavigationLink>
          <NavigationLink to="/top-memes">Top Memes</NavigationLink>
          <NavigationLink to="/my-story">My Story</NavigationLink>
          <NavigationLink to="/my-memes">My Memes</NavigationLink>
          <NavigationLink to="/watchlist">Watchlist</NavigationLink>
          <NavigationLink to="/tuzemoon">Tuzemoon</NavigationLink>
        </nav>
      </div>
    );
  }

  return (
    <nav className="flex items-center space-x-6 text-sm font-medium">
      <NavigationLink to="/">Home</NavigationLink>
      <NavigationLink to="/top-memes">Top Memes</NavigationLink>
      <NavigationLink to="/my-story">My Story</NavigationLink>
      <NavigationLink to="/my-memes">My Memes</NavigationLink>
      <NavigationLink to="/watchlist">Watchlist</NavigationLink>
      <NavigationLink to="/tuzemoon">Tuzemoon</NavigationLink>
    </nav>
  );
};

const NavigationLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link
    to={to}
    className={cn(
      "whitespace-nowrap transition-all duration-300",
      "hover:bg-[#FFB74D] hover:text-black px-3 py-2 rounded-md hover:scale-105"
    )}
  >
    {children}
  </Link>
);