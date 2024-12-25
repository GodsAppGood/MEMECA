import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-background py-8 mt-auto border-t">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <p className="text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
};