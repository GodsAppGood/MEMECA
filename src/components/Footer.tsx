import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-black py-8 mt-auto border-t border-gray-800 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-6">
          {/* Center: Social Icons */}
          <div className="flex items-center space-x-6 mb-4">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-300"
            >
              <img 
                src="/lovable-uploads/83f35217-1e3b-4120-a853-06e5228a9c3e.png" 
                alt="X (formerly Twitter)" 
                className="w-6 h-6 hover:opacity-80 transition-opacity hover:filter hover:brightness-[2.5]"
              />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-300"
            >
              <img 
                src="/lovable-uploads/756a9b1e-5da9-4f66-b59b-6f9b312dfb45.png" 
                alt="Telegram" 
                className="w-6 h-6 hover:opacity-80 transition-opacity hover:filter hover:brightness-[2.5]"
              />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-white text-sm">
              © {new Date().getFullYear()} MemeCatlandar.io
            </p>
          </div>
        </div>

        {/* Bottom Left: Privacy & Terms Text */}
        <div className="absolute bottom-4 left-4">
          <span className="text-white">
            Privacy & Terms
          </span>
        </div>
      </div>
    </footer>
  );
};