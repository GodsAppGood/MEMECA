import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AIAnalysisResponse {
  analysis?: any;
  response?: any;
  error?: string;
}

export const useAIAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeImage = async (imageUrl: string): Promise<AIAnalysisResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-analysis', {
        body: { type: 'analyze_image', data: { imageUrl } }
      });

      if (error) throw error;
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze image';
      setError(message);
      return { error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeText = async (text: string): Promise<AIAnalysisResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-analysis', {
        body: { type: 'analyze_text', data: { text } }
      });

      if (error) throw error;
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze text';
      setError(message);
      return { error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const chat = async (message: string): Promise<AIAnalysisResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-analysis', {
        body: { type: 'chat', data: { message } }
      });

      if (error) throw error;
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process chat message';
      setError(message);
      return { error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    analyzeImage,
    analyzeText,
    chat,
    isLoading,
    error
  };
};