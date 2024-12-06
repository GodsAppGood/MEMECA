import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { format } from "date-fns";
import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";

export const Filters = () => {
  const [date, setDate] = useState<Date>();
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-wrap gap-8 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="font-serif text-2xl">1</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[280px] h-[48px] font-serif text-lg">
                <CalendarIcon className="mr-2 h-5 w-5" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center" sideOffset={4}>
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
          <Select>
            <SelectTrigger className="w-[280px] h-[48px] font-serif text-lg">
              <SelectValue placeholder="Select blockchain" />
            </SelectTrigger>
            <SelectContent 
              position="popper" 
              className="w-[280px]" 
              align="center"
              sideOffset={4}
            >
              <SelectItem value="solana" className="font-serif">Solana</SelectItem>
              <SelectItem value="ethereum" className="font-serif">Ethereum</SelectItem>
              <SelectItem value="polygon" className="font-serif">Polygon</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col items-center gap-4">
          <span className="font-serif text-2xl">3</span>
          <Button 
            className="w-[280px] h-[48px] bg-[#FFB74D] text-accent-foreground hover:bg-[#FFB74D]/90 font-serif text-lg"
            onClick={() => {
              const audio = new Audio('/meow.mp3');
              audio.play().catch(console.error);
            }}
          >
            MEOW
          </Button>
        </div>
      </div>
    </div>
  );
};