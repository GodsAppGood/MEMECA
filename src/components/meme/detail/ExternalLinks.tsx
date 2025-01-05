import { ExternalLink } from "lucide-react";

interface ExternalLinksProps {
  tradeLink?: string | null;
  twitterLink?: string | null;
  telegramLink?: string | null;
}

export const ExternalLinks = ({ tradeLink, twitterLink, telegramLink }: ExternalLinksProps) => {
  return (
    <>
      {tradeLink && (
        <div>
          <h3 className="font-serif text-lg mb-2">Trade Link</h3>
          <a 
            href={tradeLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 hover:underline flex items-center"
          >
            Trade <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </div>
      )}
      {twitterLink && (
        <div>
          <h3 className="font-serif text-lg mb-2">Twitter</h3>
          <a 
            href={twitterLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 hover:underline flex items-center"
          >
            Twitter <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </div>
      )}
      {telegramLink && (
        <div>
          <h3 className="font-serif text-lg mb-2">Telegram</h3>
          <a 
            href={telegramLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 hover:underline flex items-center"
          >
            Telegram <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </div>
      )}
    </>
  );
};