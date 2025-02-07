
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Meme } from "@/types/meme";

interface MemeLinksProps {
  meme: Meme;
}

export const MemeLinks = ({ meme }: MemeLinksProps) => {
  const links = [
    { type: 'Trade', url: meme.trade_link },
    { type: 'Twitter', url: meme.twitter_link },
    { type: 'Telegram', url: meme.telegram_link },
  ].filter(link => link.url);

  if (links.length === 0) return null;

  return (
    <div className="col-span-full mt-6">
      <h3 className="font-serif text-lg mb-4">Links</h3>
      <div className="flex flex-wrap gap-4">
        {links.map(({ type, url }) => (
          <Button
            key={type}
            variant="outline"
            size="sm"
            onClick={() => window.open(url!, '_blank')}
            className="flex items-center bg-[#FFB74D] text-black hover:bg-[#FFB74D]/90 border-[#FFB74D]"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            {type}
          </Button>
        ))}
      </div>
    </div>
  );
};
