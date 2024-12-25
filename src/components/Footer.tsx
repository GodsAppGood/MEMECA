import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-background py-8 mt-auto border-t">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <nav className="mb-4">
          <ul className="flex flex-wrap justify-center gap-4">
            <li>
              <Link
                to="/terms"
                className="text-muted-foreground hover:text-[#FFB74D] transition-colors"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </nav>
        <p className="text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
};