import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

export const Support = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 w-16 h-16 z-50 transition-transform hover:scale-110"
      >
        <img
          src="/lovable-uploads/de6b35ef-6099-492e-90b2-0ab25fa75850.png"
          alt="24/7 Support"
          className="w-full h-full"
        />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chat with AI Support</DialogTitle>
          </DialogHeader>
          <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-md">
            <div className="flex gap-2">
              <div className="bg-orange-500 text-white p-3 rounded-lg max-w-[80%]">
                Hello! How can I help you today? 🐱
              </div>
            </div>
            {/* Add more chat messages here */}
          </div>
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-md"
            />
            <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors">
              Send
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};