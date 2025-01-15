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
          className="fixed bottom-4 right-4 z-50 p-2 h-12 w-12"
          size="icon"
        >
          <img 
            src="/lovable-uploads/2c298be7-d8fe-49fb-941b-910d24781b8a.png"
            alt="Support"
            className="w-full h-full"
          />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>AI Support Assistant</SheetTitle>
          <SheetDescription>
            Ask me anything about memes, tokens, or get help with the platform.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 h-[calc(100vh-200px)] overflow-y-auto">
          <AIChat />
        </div>
      </SheetContent>
    </Sheet>
  );
};