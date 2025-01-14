import { useEffect } from 'react';

export const MemeWheelWidget = () => {
  useEffect(() => {
    // Load only the widget script
    const script = document.createElement('script');
    script.src = 'https://www.memecawheel.xyz/widget/meme-widget.js';
    script.crossOrigin = "anonymous";
    script.async = true;
    
    // Add script to document
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      const scripts = document.querySelectorAll('script[src*="memecawheel.xyz"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div id="meme-wheel-widget"></div>
    </div>
  );
};