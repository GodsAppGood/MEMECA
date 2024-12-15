import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MemeLinksProps {
  meme: {
    trade_link?: string | null;
    twitter_link?: string | null;
    telegram_link?: string | null;
  };
}

export const MemeLinks = ({ meme }: MemeLinksProps) => {
  const links = [
    { type: 'Trade', url: meme.trade_link },
    { type: 'Twitter', url: meme.twitter_link },
    { type: 'Telegram', url: meme.telegram_link },
  ].filter(link => link.url);

  if (links.length === 0) return null;

  return (
    <div className="col-span-full">
      <h3 className="font-serif text-lg mb-4">Links</h3>
      <div className="flex flex-wrap gap-4">
        {links.map(({ type, url }) => (
          <Button
            key={type}
            variant="outline"
            size="sm"
            onClick={() => window.open(url!, '_blank')}
            className="flex items-center"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            {type}
          </Button>
        ))}
      </div>
    </div>
  );
};