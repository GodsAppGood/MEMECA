import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-black py-8 mt-auto border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          {/* Left: Privacy & Terms */}
          <div className="mb-4 md:mb-0">
            <Link
              to="/terms"
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
              <img 
                src="/lovable-uploads/83f35217-1e3b-4120-a853-06e5228a9c3e.png" 
                alt="X (formerly Twitter)" 
                className="w-6 h-6 hover:opacity-80 transition-opacity"
              />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#F5A623] transition-colors duration-300"
            >
              <img 
                src="/lovable-uploads/756a9b1e-5da9-4f66-b59b-6f9b312dfb45.png" 
                alt="Telegram" 
                className="w-6 h-6 hover:opacity-80 transition-opacity"
              />
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