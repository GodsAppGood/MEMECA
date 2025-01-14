import { useEffect, useRef, useState } from 'react';
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    MemeWheel?: {
      init: (options: {
        container: string;
        theme?: 'light' | 'dark';
        onLoad?: () => void;
        onError?: (error: any) => void;
      }) => void;
    };
  }
}

export const MemeWheelWidget = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (document.querySelector('script[src*="memecawheel.xyz"]')) {
          console.log('MemeWheel script already exists');
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://www.memecawheel.xyz/widget/meme-widget.js';
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          console.log('MemeWheel script loaded successfully');
          resolve();
        };
        
        script.onerror = (err) => {
          console.error('Failed to load MemeWheel script:', err);
          reject(new Error('Failed to load widget script'));
        };

        document.body.appendChild(script);
      });
    };

    const initializeWidget = async () => {
      try {
        await loadScript();
        
        if (!window.MemeWheel) {
          throw new Error('MemeWheel not found in window object');
        }

        if (!containerRef.current) {
          throw new Error('Widget container not found');
        }

        window.MemeWheel.init({
          container: 'meme-wheel-widget',
          theme: 'light',
          onLoad: () => {
            console.log('MemeWheel widget initialized successfully');
            setIsLoaded(true);
          },
          onError: (err) => {
            console.error('MemeWheel initialization error:', err);
            toast({
              variant: "destructive",
              title: "Widget Error",
              description: "Failed to initialize MemeWheel widget"
            });
          }
        });
      } catch (error) {
        console.error('Error setting up MemeWheel:', error);
        toast({
          variant: "destructive",
          title: "Widget Error",
          description: error instanceof Error ? error.message : "Failed to setup widget"
        });
      }
    };

    initializeWidget();

    return () => {
      const scripts = document.querySelectorAll('script[src*="memecawheel.xyz"]');
      scripts.forEach(script => script.remove());
      setIsLoaded(false);
    };
  }, [toast]);

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-4 left-4 z-50 transition-opacity duration-300"
      style={{ opacity: isLoaded ? 1 : 0 }}
    >
      <div 
        id="meme-wheel-widget" 
        className="w-[300px] h-[300px] bg-transparent rounded-lg shadow-lg"
      />
    </div>
  );
};