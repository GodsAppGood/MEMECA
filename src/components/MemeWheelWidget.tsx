import { useEffect } from 'react';

export const MemeWheelWidget = () => {
  useEffect(() => {
    // Load external scripts
    const loadScripts = async () => {
      const scripts = [
        'https://unpkg.com/react@18/umd/react.production.min.js',
        'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
        'https://www.memecawheel.xyz/widget/meme-widget.js'
      ];

      for (const src of scripts) {
        const script = document.createElement('script');
        script.src = src;
        script.crossOrigin = "anonymous";
        document.body.appendChild(script);
      }
    };

    loadScripts();

    return () => {
      // Cleanup scripts on unmount
      const scripts = document.querySelectorAll('script[src*="unpkg.com"], script[src*="memecawheel.xyz"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div id="meme-wheel-widget"></div>
    </div>
  );
};