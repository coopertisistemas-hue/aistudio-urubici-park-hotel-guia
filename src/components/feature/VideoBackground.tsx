
import { useRef, useEffect } from 'react';

const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleReady = () => {
      video.style.opacity = '1';
    };

    if (video.readyState >= 4) {
      // Already ready (e.g. cached)
      video.style.opacity = '1';
    } else {
      video.addEventListener('canplaythrough', handleReady, { once: true });
    }

    return () => {
      video.removeEventListener('canplaythrough', handleReady);
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
        preload="auto"
        className="w-full h-full object-cover transition-opacity duration-1000"
        style={{ opacity: 0 }}
        poster="https://public.readdy.ai/ai/img_res/5b16ac4f3987737750687430ac4e2a58.jpg"
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
