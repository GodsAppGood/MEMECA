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
import { MessageCircle } from "lucide-react";

export const Support = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-4 right-4 z-50 rounded-full h-28 w-28 shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90 animate-bounce-rotate"
          size="icon"
        >
          <MessageCircle className="h-12 w-12" />
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