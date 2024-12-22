import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface DateSelectorProps {
  date: Date | undefined;
  setDate: (value: Date | undefined) => void;
}

export const DateSelector = ({ date, setDate }: DateSelectorProps) => {
  const [timeInput, setTimeInput] = useState(date ? format(date, "HH:mm") : "");

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    setTimeInput(timeValue);

    if (date && timeValue) {
      const [hours, minutes] = timeValue.split(':').map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours, minutes);
      setDate(newDate);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-serif mb-2">Listing Time</label>
      <div className="flex gap-4">
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
              onSelect={(newDate) => {
                if (newDate) {
                  // Keep existing time if available, otherwise use current time
                  const currentTime = timeInput ? timeInput.split(':').map(Number) : [new Date().getHours(), new Date().getMinutes()];
                  newDate.setHours(currentTime[0], currentTime[1]);
                  setDate(newDate);
                  if (!timeInput) {
                    setTimeInput(format(newDate, "HH:mm"));
                  }
                } else {
                  setDate(undefined);
                  setTimeInput("");
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <div className="relative">
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="time"
            value={timeInput}
            onChange={handleTimeChange}
            className="pl-10 font-serif"
          />
        </div>
      </div>
      {date && (
        <p className="text-sm text-muted-foreground">
          Meme will be listed on: {format(date, "PPP 'at' HH:mm")}
        </p>
      )}
    </div>
  );
};
