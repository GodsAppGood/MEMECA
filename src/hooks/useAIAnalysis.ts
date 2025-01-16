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
      console.log('Analyzing image:', { imageUrl, timestamp: new Date().toISOString() });
      
      const { data, error: functionError } = await supabase.functions.invoke('ai-analysis', {
        body: { type: 'analyze_image', data: { imageUrl } }
      });

      if (functionError) {
        console.error('Function error:', functionError);
        throw functionError;
      }
      
      console.log('Analysis complete:', { data, timestamp: new Date().toISOString() });
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze image';
      console.error('Analysis error:', { message, error: err, timestamp: new Date().toISOString() });
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
      console.log('Analyzing text:', { text, timestamp: new Date().toISOString() });
      
      const { data, error: functionError } = await supabase.functions.invoke('ai-analysis', {
        body: { type: 'analyze_text', data: { text } }
      });

      if (functionError) {
        console.error('Function error:', functionError);
        throw functionError;
      }
      
      console.log('Analysis complete:', { data, timestamp: new Date().toISOString() });
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze text';
      console.error('Analysis error:', { message, error: err, timestamp: new Date().toISOString() });
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
      console.log('Processing chat message:', { message, timestamp: new Date().toISOString() });
      
      const { data, error: functionError } = await supabase.functions.invoke('ai-analysis', {
        body: { type: 'chat', data: { message } }
      });

      if (functionError) {
        console.error('Function error:', functionError);
        throw functionError;
      }
      
      console.log('Chat response received:', { data, timestamp: new Date().toISOString() });
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process chat message';
      console.error('Chat error:', { message, error: err, timestamp: new Date().toISOString() });
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