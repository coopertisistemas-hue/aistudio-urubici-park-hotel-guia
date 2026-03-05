import { useState, useEffect, useCallback } from 'react';
import { useWeather } from '../hooks/useWeather';
import { getWeatherIcon } from '../services/weatherService';

interface StickerMessage {
  icon: string;
  text: string;
}

interface TopStickerProps {
  messages: StickerMessage[];
}

const TopSticker = ({ messages }: TopStickerProps) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const { data, refetch } = useWeather();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const refreshWeather = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    const interval = setInterval(refreshWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshWeather]);

  useEffect(() => {
    if (messages.length <= 1) return;
    
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 22000);

    return () => clearInterval(interval);
  }, [messages.length]);

  if (messages.length === 0 && !data?.current) return null;

  const weatherIcon = data?.current ? getWeatherIcon(data.current.weatherCode) : '🌤️';
  const temperature = data?.current?.temperature ?? '--';
  const currentMessage = messages[messageIndex];

  return (
    <div className="w-full bg-white/5 border-y border-white/10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-8 gap-4">
          {/* Weather - Fixed on left */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className={`text-base ${!isReducedMotion ? 'animate-breathe' : ''}`}>
              {weatherIcon}
            </span>
            <span className="text-white/90 text-xs font-medium whitespace-nowrap">
              {temperature}°C em Urubici
            </span>
          </div>

          {/* Separator */}
          <span className="text-white/30 text-xs flex-shrink-0">•</span>

          {/* Rotating Message - Horizontal marquee */}
          <div className="flex-1 overflow-hidden relative h-5 flex items-center">
            {isReducedMotion ? (
              <span className="text-white/70 text-xs whitespace-nowrap">
                {currentMessage.icon} {currentMessage.text}
              </span>
            ) : (
              <span 
                key={messageIndex}
                className="text-white/70 text-xs whitespace-nowrap animate-sticker-marquee"
              >
                {currentMessage.icon} {currentMessage.text}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopSticker;
