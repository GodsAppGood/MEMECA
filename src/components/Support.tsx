import { Button } from "@/components/ui/button";
import { AIChat } from "@/components/AIChat";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Support = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-4 right-4 z-50 rounded-full h-28 w-28 shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90 animate-bounce-rotate group"
          size="icon"
        >
          <img 
            src="/lovable-uploads/a9f4da54-5898-472e-bab6-9790faa54c27.png" 
            alt="24/7 Support"
            className="h-16 w-16 group-hover:scale-110 transition-transform duration-200"
          />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[440px] p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle>AI Support Assistant</SheetTitle>
          <SheetDescription>
            Ask me anything about memes, tokens, or get help with the platform.
          </SheetDescription>
        </SheetHeader>
        <div className="h-[calc(100vh-140px)]">
          <AIChat />
        </div>
      </SheetContent>
    </Sheet>
  );
};