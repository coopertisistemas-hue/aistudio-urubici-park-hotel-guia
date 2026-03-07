import { useEffect, useRef, useState } from 'react';

interface VideoBackgroundProps {
  videoUrl?: string | null;
}

const FALLBACK_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

const VideoBackground = ({ videoUrl }: VideoBackgroundProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
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
  }, [videoUrl]);

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
        <source src={videoUrl || FALLBACK_VIDEO_URL} type="video/mp4" />
        <source src={FALLBACK_VIDEO_URL} type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
      <div className="absolute inset-0 bg-black/30"></div>
    </div>
  );
};

export default VideoBackground;
