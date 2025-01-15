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
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    const loadScript = () => {
      if (scriptLoadedRef.current) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://www.memecawheel.xyz/widget/meme-widget.js';
        script.type = 'text/javascript';
        script.async = false;
        
        script.onload = () => {
          scriptLoadedRef.current = true;
          resolve();
        };
        
        script.onerror = (err) => {
          scriptLoadedRef.current = false;
          reject(new Error('Failed to load widget script'));
        };

        document.head.appendChild(script);
      });
    };

    const initializeWidget = async () => {
      try {
        await loadScript();
        
        setTimeout(() => {
          if (!window.MemeWheel || !containerRef.current) {
            return;
          }

          window.MemeWheel.init({
            container: 'meme-wheel-widget',
            theme: 'light',
            onLoad: () => {
              setIsLoaded(true);
            }
          });
        }, 1000);
      } catch (error) {
        console.error('Error setting up MemeWheel:', error);
      }
    };

    initializeWidget();

    return () => {
      if (scriptLoadedRef.current) {
        const scripts = document.querySelectorAll('script[src*="memecawheel.xyz"]');
        scripts.forEach(script => script.remove());
        scriptLoadedRef.current = false;
        setIsLoaded(false);
      }
    };
  }, []);

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