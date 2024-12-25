import { Link } from "react-router-dom";
import { Twitter, Telegram } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-black py-8 mt-auto border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          {/* Left: Privacy & Terms */}
          <div className="mb-4 md:mb-0">
            <Link
              to="#"
              className="text-white hover:text-[#F5A623] transition-colors duration-300"
            >
              Privacy & Terms
            </Link>
          </div>

          {/* Center: Social Icons */}
          <div className="flex items-center space-x-6">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#F5A623] transition-colors duration-300"
            >
              <Twitter size={24} />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#F5A623] transition-colors duration-300"
            >
              <Telegram size={24} />
            </a>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="text-center">
          <p className="text-white text-sm">
            © {new Date().getFullYear()} MemeCatlandar.io
          </p>
        </div>
      </div>
    </footer>
  );
};