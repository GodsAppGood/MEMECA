import { Meme } from "@/types/meme";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface MemeLinksProps {
  meme: Meme;
}

export const MemeLinks = ({ meme }: MemeLinksProps) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {meme.trade_link && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(meme.trade_link, '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Trade Link
        </Button>
      )}
      {meme.twitter_link && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(meme.twitter_link, '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Twitter
        </Button>
      )}
      {meme.telegram_link && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(meme.telegram_link, '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Telegram
        </Button>
      )}
    </div>
  );
};