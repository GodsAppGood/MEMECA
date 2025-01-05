import { ReactNode } from "react";

interface ContainerLayoutProps {
  children: ReactNode;
  className?: string;
}

export const ContainerLayout = ({ children, className = "" }: ContainerLayoutProps) => {
  return (
    <div className={`container mx-auto px-4 py-8 ${className}`}>
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  );
};