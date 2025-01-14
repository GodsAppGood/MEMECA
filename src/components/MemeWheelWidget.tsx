import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    MemeWheel?: {
      init: (options: any) => void;
    };
  }
}

export const MemeWheelWidget = () => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    console.log('MemeWheel widget mounting...');
    
    const script = document.createElement('script');
    script.src = 'https://www.memecawheel.xyz/widget/meme-widget.js';
    script.crossOrigin = "anonymous";
    script.async = true;
    
    scriptRef.current = script;

    script.onload = () => {
      console.log('MemeWheel script loaded successfully');
      
      if (window.MemeWheel && widgetRef.current) {
        try {
          window.MemeWheel.init({
            container: 'meme-wheel-widget',
            theme: 'light'
          });
          console.log('MemeWheel widget initialized');
        } catch (error) {
          console.error('Error initializing MemeWheel widget:', error);
        }
      }
    };

    script.onerror = (error) => {
      console.error('Error loading MemeWheel widget script:', error);
    };

    document.body.appendChild(script);

    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove();
      }
      const scripts = document.querySelectorAll('script[src*="memecawheel.xyz"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  return (
    <div ref={widgetRef}>
      <div id="meme-wheel-widget"></div>
    </div>
  );
};