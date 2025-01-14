import { useEffect, useRef } from 'react';

export const MemeWheelWidget = () => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Create and load widget script
    const script = document.createElement('script');
    script.src = 'https://www.memecawheel.xyz/widget/meme-widget.js';
    script.crossOrigin = "anonymous";
    
    // Store script reference
    scriptRef.current = script;

    // Add script load handler
    script.onload = () => {
      console.log('MemeWheel widget script loaded');
      // Ensure the widget container exists
      if (widgetRef.current) {
        widgetRef.current.style.display = 'block';
      }
    };

    script.onerror = (error) => {
      console.error('Error loading MemeWheel widget:', error);
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
      className="fixed bottom-4 left-4 z-50" 
      style={{ display: 'block', minWidth: '200px', minHeight: '200px' }}
      ref={widgetRef}
    >
      <div id="meme-wheel-widget"></div>
    </div>
  );
};