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
    }, 4000);

    return () => clearInterval(interval);
  }, [messages.length]);

  if (messages.length === 0 && !data?.current) return null;

  const weatherIcon = data?.current ? getWeatherIcon(data.current.weatherCode) : '🌤️';
  const temperature = data?.current?.temperature ?? '--';

  return (
    <div className="w-full mb-1">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-between py-1.5 gap-3">
          {/* Weather - Fixed on left */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className={`text-lg ${!isReducedMotion ? 'animate-breathe' : ''}`}>
              {weatherIcon}
            </span>
            <span className="text-white/90 text-xs font-medium whitespace-nowrap">
              {temperature}°C em Urubici
            </span>
          </div>

          {/* Rotating Message - Right side */}
          <div className="relative min-w-[120px] h-5 flex items-center overflow-hidden">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`absolute flex items-center gap-1 transition-opacity duration-300 ${
                  isReducedMotion ? 'static' : 'absolute'
                }`}
                style={{
                  opacity: idx === messageIndex && !isReducedMotion ? 1 : isReducedMotion && idx === 0 ? 1 : 0,
                  transform: isReducedMotion 
                    ? 'none' 
                    : idx === messageIndex 
                      ? 'translateY(0)' 
                      : 'translateY(10px)',
                }}
              >
                <span className="text-white/70 text-xs whitespace-nowrap">{msg.icon}</span>
                <span className="text-white/70 text-xs whitespace-nowrap">{msg.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopSticker;
