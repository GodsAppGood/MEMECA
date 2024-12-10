import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface FormFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  blockchain: string;
  setBlockchain: (value: string) => void;
  date: Date | undefined;
  setDate: (value: Date | undefined) => void;
  tradeLink: string;
  setTradeLink: (value: string) => void;
  twitterLink: string;
  setTwitterLink: (value: string) => void;
  telegramLink: string;
  setTelegramLink: (value: string) => void;
  maxDescriptionLength: number;
}

export const FormFields = ({
  title,
  setTitle,
  description,
  setDescription,
  blockchain,
  setBlockchain,
  date,
  setDate,
  tradeLink,
  setTradeLink,
  twitterLink,
  setTwitterLink,
  telegramLink,
  setTelegramLink,
  maxDescriptionLength,
}: FormFieldsProps) => {
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxDescriptionLength) {
      setDescription(text);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-serif mb-2">Meme Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="font-serif"
          placeholder="Enter meme title"
        />
      </div>

      <div>
        <label className="block text-sm font-serif mb-2">Short Description</label>
        <Textarea
          value={description}
          onChange={handleDescriptionChange}
          className="font-serif resize-none"
          placeholder="Enter description (max 200 characters)"
          maxLength={maxDescriptionLength}
        />
        <p className="text-sm text-gray-500 mt-1">
          {maxDescriptionLength - description.length} characters remaining
        </p>
      </div>

      <div>
        <label className="block text-sm font-serif mb-2">Blockchain</label>
        <Select value={blockchain} onValueChange={setBlockchain}>
          <SelectTrigger className="w-full font-serif bg-white">
            <SelectValue placeholder="Select blockchain" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {["Solana", "Ethereum", "Polygon", "Ton", "BSC", "Base", "Arbitrum", 
              "Avalanche", "Hyperliquid", "Optimism", "Sui", "Celo", "Osmosis", 
              "Pulsechain", "Blast", "Mantle", "Aptos", "Linea", "Sei", "Starknet", 
              "Chronos", "Fantom", "Tron", "Hedera", "Zksync", "Gnosis", "Scroll", 
              "Cordano", "Near", "Manta", "Injective", "Zora"].map((chain) => (
              <SelectItem 
                key={chain.toLowerCase()} 
                value={chain.toLowerCase()} 
                className="font-serif"
              >
                {chain}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-serif mb-2">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full font-serif justify-start text-left bg-white">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <label className="block text-sm font-serif mb-2">Trade Link (Optional)</label>
        <Input
          type="url"
          value={tradeLink}
          onChange={(e) => setTradeLink(e.target.value)}
          className="font-serif"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-serif mb-2">Twitter Link</label>
        <Input
          type="url"
          value={twitterLink}
          onChange={(e) => setTwitterLink(e.target.value)}
          className="font-serif"
          placeholder="https://twitter.com/..."
        />
      </div>

      <div>
        <label className="block text-sm font-serif mb-2">Telegram Link</label>
        <Input
          type="url"
          value={telegramLink}
          onChange={(e) => setTelegramLink(e.target.value)}
          className="font-serif"
          placeholder="https://t.me/..."
        />
      </div>
    </div>
  );
};