import { Button } from "./ui/button";
import { MessageCircle } from "lucide-react";

export const Support = () => {
  return (
    <Button
      size="lg"
      className="fixed bottom-4 right-4 bg-primary hover:bg-primary/90 rounded-full w-16 h-16 p-0"
    >
      <MessageCircle className="w-8 h-8" />
      <span className="sr-only">24/7 Support</span>
    </Button>
  );
};