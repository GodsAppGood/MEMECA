import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

interface FiltersProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  blockchain: string | undefined;
  setBlockchain: (blockchain: string) => void;
  onSearch: () => void;
}

export const Filters = ({ date, setDate, blockchain, setBlockchain, onSearch }: FiltersProps) => {
  const blockchains = [
    "Solana", "Ethereum", "Polygon", "Ton", "BSC", "Base", "Arbitrum", 
    "Avalanche", "Hyperliquid", "Optimism", "Sui", "Celo", "Osmosis", 
    "Pulsechain", "Blast", "Mantle", "Aptos", "Linea", "Sei", "Starknet", 
    "Chronos", "Fantom", "Tron", "Hedera", "Zksync", "Gnosis", "Scroll", 
    "Cordano", "Near", "Manta", "Injective", "Zora"
  ];

  return (
    <div className="container mx-auto px-4 py-16 overflow-x-hidden">
      <div className="flex flex-wrap gap-8 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="font-serif text-2xl">1</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[280px] h-[48px] font-serif text-lg transition-all duration-200 hover:scale-105">
                <CalendarIcon className="mr-2 h-5 w-5" />
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

        <div className="flex flex-col items-center gap-4">
          <span className="font-serif text-2xl">2</span>
          <Select value={blockchain} onValueChange={setBlockchain}>
            <SelectTrigger className="w-[280px] h-[48px] font-serif text-lg transition-all duration-200 hover:scale-105">
              <SelectValue placeholder="Select blockchain" />
            </SelectTrigger>
            <SelectContent className="w-[280px] bg-white">
              {blockchains.map((chain) => (
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

        <div className="flex flex-col items-center gap-4">
          <span className="font-serif text-2xl">3</span>
          <Button 
            className="w-[280px] h-[48px] bg-[#FFB74D] text-accent-foreground hover:bg-[#FFB74D]/90 font-serif text-lg transition-all duration-200 hover:scale-105"
            onClick={() => {
              const audio = new Audio('/meow.mp3');
              audio.play().catch(console.error);
              onSearch();
            }}
          >
            MEOW
          </Button>
        </div>
      </div>
    </div>
  );
};