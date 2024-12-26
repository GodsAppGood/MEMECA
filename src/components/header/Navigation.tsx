import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export const Navigation = () => {
  const isMobile = useIsMobile();

  if (isMobile) return null;

  return (
    <nav className="flex items-center space-x-6 text-sm font-medium">
      <Link
        to="/"
        className="transition-colors duration-300 hover:text-[#F5A623] px-3 py-2 rounded-md"
      >
        Home
      </Link>
      <Link
        to="/top-memes"
        className="transition-colors duration-300 hover:text-[#F5A623] px-3 py-2 rounded-md"
      >
        Top Memes
      </Link>
      <Link
        to="/my-story"
        className="transition-colors duration-300 hover:text-[#F5A623] px-3 py-2 rounded-md"
      >
        My Story
      </Link>
      <Link
        to="/my-memes"
        className="transition-colors duration-300 hover:text-[#F5A623] px-3 py-2 rounded-md"
      >
        My Memes
      </Link>
      <Link
        to="/watchlist"
        className="transition-colors duration-300 hover:text-[#F5A623] px-3 py-2 rounded-md"
      >
        Watchlist
      </Link>
      <Link
        to="/tuzemoon"
        className="transition-colors duration-300 hover:text-[#F5A623] px-3 py-2 rounded-md"
      >
        Tuzemoon
      </Link>
    </nav>
  );
};