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
      const existingScript = document.querySelector('script[src*="memecawheel.xyz"]');
      if (existingScript) {
        existingScript.remove();
      }

      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://www.memecawheel.xyz/widget/meme-widget.js';
        script.type = 'text/javascript';
        script.async = false;
        
        script.onload = () => {
          console.log('MemeWheel script loaded successfully');
          resolve();
        };
        
        script.onerror = (err) => {
          console.error('Failed to load MemeWheel script:', err);
          reject(new Error('Failed to load widget script'));
        };

        document.head.appendChild(script);
      });
    };

    const initializeWidget = async () => {
      try {
        await loadScript();
        
        // Добавляем задержку для уверенности, что скрипт полностью загрузился
        setTimeout(() => {
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
        }, 1000);
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