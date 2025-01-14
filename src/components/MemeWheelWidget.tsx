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
    
    // Create and load widget script
    const script = document.createElement('script');
    script.src = 'https://www.memecawheel.xyz/widget/meme-widget.js';
    script.crossOrigin = "anonymous";
    
    // Store script reference
    scriptRef.current = script;

    // Add script load handler
    script.onload = () => {
      console.log('MemeWheel script loaded successfully');
      
      // Initialize widget after script loads
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

    // Add script to document
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      if (scriptRef.current) {
        scriptRef.current.remove();
      }
      // Remove any other widget scripts
      const scripts = document.querySelectorAll('script[src*="memecawheel.xyz"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  return (
    <div 
      className="fixed bottom-4 left-4 z-50 animate-float" 
      style={{ 
        display: 'block', 
        minWidth: '300px', 
        minHeight: '300px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        padding: '16px'
      }}
      ref={widgetRef}
    >
      <div id="meme-wheel-widget"></div>
    </div>
  );
};