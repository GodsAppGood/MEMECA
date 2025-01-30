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
import { useUserRole } from "@/hooks/useUserRole";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useIsMobile } from "@/hooks/use-mobile";

export const Support = () => {
  const { isVerified, isLoading } = useUserRole();
  const isMobile = useIsMobile();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-4 right-4 z-50 rounded-full h-28 w-28 shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90 animate-pulse-border group"
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
          <SheetTitle>MemecAI Support Assistant</SheetTitle>
          <SheetDescription>
            Ask me anything about memes, tokens, or get help with the platform.
          </SheetDescription>
        </SheetHeader>
        <div className={`${isMobile ? 'h-[calc(100vh-240px)]' : 'h-[calc(100vh-140px)]'}`}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : isVerified ? (
            <AIChat />
          ) : (
            <div className="p-6">
              <Alert variant="destructive">
                <AlertDescription>
                  Only verified users can access the chat support. Please verify your account to continue.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};