import { useState, useEffect } from 'react';

export interface Review {
  name: string;
  rating: string;
  text: string;
}

interface ReviewCarouselProps {
  reviews: Review[];
  reviewUrl: string;
  mapsUrl: string;
}

const ReviewCarousel = ({ reviews, reviewUrl, mapsUrl }: ReviewCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    (window as unknown as { _touchStartX: number })._touchStartX = touch.clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const startX = (window as unknown as { _touchStartX?: number })._touchStartX;
    if (startX === undefined) return;
    
    const touch = e.changedTouches[0];
    const diff = startX - touch.clientX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < reviews.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  useEffect(() => {
    // Autoplay OFF by default - removed interval
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (reviews.length === 0) return null;

  return (
    <div className="px-4 mb-6">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center justify-center mb-4">
        <h3 className="text-white font-bold text-lg flex items-center gap-2 drop-shadow-md">
          <i className="ri-google-fill text-white"></i>
          Avaliações recentes de hóspedes
        </h3>
        <p className="text-white/60 text-xs mt-1">Opiniões reais de quem já se hospedou conosco</p>
      </div>

      {/* Carousel - No card wrapper */}
      <div 
        className="relative overflow-hidden mb-4"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {reviews.map((review, index) => (
            <div 
              key={index}
              className="w-full flex-shrink-0 px-2"
            >
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-yellow-400 text-sm tracking-widest">
                    {review.rating}
                  </span>
                </div>
                <p className="text-white/80 text-sm leading-relaxed italic text-center mb-3">
                  "{review.text}"
                </p>
                <p className="text-white/60 text-xs text-center">
                  — {review.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation dots */}
      {reviews.length > 1 && (
        <div className="flex justify-center gap-2 mb-5">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-yellow-400 w-4' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Ver avaliação ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* CTA Text */}
      <div className="text-center mb-4">
        <p className="text-white font-medium text-sm mb-1">
          Gostou da sua estadia?
        </p>
        <p className="text-white/60 text-xs">
          Sua avaliação ajuda outros hóspedes.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col gap-3 max-w-sm mx-auto">
        <a
          href={reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold text-sm uppercase tracking-wide py-3 px-6 rounded-lg text-center transition-all shadow-lg hover:shadow-xl flex justify-center items-center gap-2"
          aria-label="Avaliar minha estadia no Google"
        >
          <i className="ri-star-smile-fill"></i>
          Avaliar minha estadia
        </a>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium text-sm py-3 px-6 rounded-lg text-center transition-all flex justify-center items-center gap-2"
          aria-label="Ver todas as avaliações no Google"
        >
          <i className="ri-map-pin-2-line"></i>
          Ver avaliações no Google
        </a>
      </div>
    </div>
  );
};

export default ReviewCarousel;
