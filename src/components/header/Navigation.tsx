import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <nav className="flex items-center space-x-6 text-sm font-medium">
      <Link
        to="/"
        className="transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform hover:after:origin-bottom-left hover:after:scale-x-100"
      >
        Home
      </Link>
      <Link
        to="/top-memes"
        className="transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform hover:after:origin-bottom-left hover:after:scale-x-100"
      >
        Top Memes
      </Link>
      <Link
        to="/my-story"
        className="transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform hover:after:origin-bottom-left hover:after:scale-x-100"
      >
        My Story
      </Link>
      <Link
        to="/my-memes"
        className="transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform hover:after:origin-bottom-left hover:after:scale-x-100"
      >
        My Memes
      </Link>
      <Link
        to="/watchlist"
        className="transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform hover:after:origin-bottom-left hover:after:scale-x-100"
      >
        Watchlist
      </Link>
      <Link
        to="/tuzemoon"
        className="transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform hover:after:origin-bottom-left hover:after:scale-x-100"
      >
        Tuzemoon
      </Link>
    </nav>
  );
};