import { useEffect, useRef } from "react";

export const HeroVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <video
      ref={videoRef}
      className="absolute top-0 left-0 min-w-full min-h-full w-auto h-auto object-cover"
      autoPlay
      loop
      muted
      playsInline
    >
      <source src="/background-video.webm" type="video/webm" />
      Your browser does not support the video tag.
    </video>
  );
};