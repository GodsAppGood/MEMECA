import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import { Loader2 } from "lucide-react";

export const AIChat = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const { chat, isLoading, error } = useAIAnalysis();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const result = await chat(message);
    if (result.response) {
      setResponse(result.response);
    }
    setMessage('');
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4">
      <div className="rounded-lg bg-gray-100 p-4 min-h-[100px]">
        {response || 'No messages yet'}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Send'
          )}
        </Button>
      </form>
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};