import { useEffect } from "react";

export const WheelWidget = () => {
  useEffect(() => {
    // Создаем контейнер для виджета
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'meme-widget';
    widgetContainer.setAttribute('data-mode', 'embed');
    widgetContainer.setAttribute('data-section', 'wheel-only');
    widgetContainer.className = 'fixed bottom-36 right-4 z-50';
    
    // Добавляем контейнер в DOM
    document.body.appendChild(widgetContainer);

    // Инициализируем виджет
    if (window.MemeWidget) {
      window.MemeWidget.init('meme-widget');
    }

    // Очистка при размонтировании
    return () => {
      widgetContainer.remove();
    };
  }, []);

  return null;
};