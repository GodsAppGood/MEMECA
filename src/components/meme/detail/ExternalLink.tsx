import { ExternalLink as ExternalLinkIcon } from "lucide-react";

interface ExternalLinkProps {
  type: string;
  url: string;
}

export const ExternalLink = ({ type, url }: ExternalLinkProps) => {
  if (!url) return null;

  return (
    <div>
      <h3 className="font-serif text-lg mb-2">{type}</h3>
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-500 hover:underline flex items-center"
      >
        {type} <ExternalLinkIcon className="ml-1 h-4 w-4" />
      </a>
    </div>
  );
};