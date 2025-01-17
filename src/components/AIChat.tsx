import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AIChat = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const { chat, isLoading, error } = useAIAnalysis();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const result = await chat(message);
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        return;
      }
      if (result.response) {
        setResponse(result.response);
      }
    } catch (err) {
      console.error('Chat error:', err);
      toast({
        title: "Error",
        description: "Unable to get response from AI assistant. Please try again later.",
        variant: "destructive",
      });
    }
    setMessage('');
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4">
      <div className="rounded-lg bg-gray-100 p-4 min-h-[100px] overflow-y-auto max-h-[300px]">
        {response || 'No messages yet. Ask me anything about memes, tokens, or get help with the platform!'}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !message.trim()}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Send'
          )}
        </Button>
      </form>
      
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
};