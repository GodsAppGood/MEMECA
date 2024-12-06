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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <span className="font-serif text-xl">1</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] font-serif">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="font-serif text-xl">2</span>
          <Select>
            <SelectTrigger className="w-[240px] font-serif">
              <SelectValue placeholder="Select blockchain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solana">Solana</SelectItem>
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="polygon">Polygon</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="font-serif text-xl">3</span>
          <Button className="w-[240px] bg-accent text-accent-foreground hover:bg-accent/90 font-serif">
            MEOW
          </Button>
        </div>
      </div>
    </div>
  );
};