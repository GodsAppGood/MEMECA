import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export const Navigation = () => {
  const isMobile = useIsMobile();

  if (isMobile) return null;

  return (
    <nav className="flex items-center space-x-6 text-sm font-medium">
      <Link
        to="/"
        className="transition-all duration-300 hover:bg-[#FFB74D] hover:text-black px-3 py-2 rounded-md hover:scale-105"
      >
        Home
      </Link>
      <Link
        to="/top-memes"
        className="transition-all duration-300 hover:bg-[#FFB74D] hover:text-black px-3 py-2 rounded-md hover:scale-105"
      >
        Top Memes
      </Link>
      <Link
        to="/my-story"
        className="transition-all duration-300 hover:bg-[#FFB74D] hover:text-black px-3 py-2 rounded-md hover:scale-105"
      >
        My Story
      </Link>
      <Link
        to="/my-memes"
        className="transition-all duration-300 hover:bg-[#FFB74D] hover:text-black px-3 py-2 rounded-md hover:scale-105"
      >
        My Memes
      </Link>
      <Link
        to="/watchlist"
        className="transition-all duration-300 hover:bg-[#FFB74D] hover:text-black px-3 py-2 rounded-md hover:scale-105"
      >
        Watchlist
      </Link>
      <Link
        to="/tuzemoon"
        className="transition-all duration-300 hover:bg-[#FFB74D] hover:text-black px-3 py-2 rounded-md hover:scale-105"
      >
        Tuzemoon
      </Link>
    </nav>
  );
};