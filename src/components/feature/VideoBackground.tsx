
import { useState, useRef, useEffect } from 'react';

const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleReady = () => {
      setVideoReady(true);
    };

    if (video.readyState >= 4) {
      setVideoReady(true);
    } else {
      video.addEventListener('loadeddata', handleReady, { once: true });
    }

    return () => {
      video.removeEventListener('loadeddata', handleReady);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="w-full h-full object-cover transition-opacity duration-700"
        style={{ opacity: prefersReducedMotion || videoReady ? 1 : 0 }}
      >
        <source
          src="https://www.dropbox.com/scl/fi/4ehdjudid9l7uwdnnz8z1/urubici-park-hotel-apresenta-o.mp4?rlkey=1cbsw7stm5qpwpuq7irfbw3to&st=nw959pl5&dl=1"
          type="video/mp4"
        />
        <source
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
          type="video/mp4"
        />
        Seu navegador não suporta vídeos HTML5.
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
      <div className="absolute inset-0 bg-black/30"></div>
    </div>
  );
};

export default VideoBackground;
