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
          className="fixed bottom-4 right-4 z-50 rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
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