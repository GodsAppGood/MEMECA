import { useEffect, useRef, useState } from 'react';

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
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    const loadWidget = () => {
      if (!containerRef.current) {
        console.error('Widget container not found');
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.memecawheel.xyz/widget/meme-widget.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      scriptRef.current = script;

      script.onload = () => {
        console.log('MemeWheel script loaded successfully');
        if (window.MemeWheel) {
          try {
            window.MemeWheel.init({
              container: 'meme-wheel-widget',
              theme: 'light',
              onLoad: () => {
                console.log('MemeWheel widget initialized successfully');
                setIsLoaded(true);
              },
              onError: (err) => {
                console.error('MemeWheel initialization error:', err);
                setError('Failed to initialize widget');
              }
            });
          } catch (err) {
            console.error('Error initializing MemeWheel:', err);
            setError('Widget initialization failed');
          }
        } else {
          console.error('MemeWheel not found in window object');
          setError('Widget script loaded but initialization failed');
        }
      };

      script.onerror = (err) => {
        console.error('Failed to load MemeWheel script:', err);
        setError('Failed to load widget script');
      };

      document.body.appendChild(script);
    };

    loadWidget();

    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove();
      }
      // Cleanup any existing scripts to prevent duplicates
      const scripts = document.querySelectorAll('script[src*="memecawheel.xyz"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  if (error) {
    console.error('MemeWheel widget error:', error);
    return null; // Hide widget on error
  }

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