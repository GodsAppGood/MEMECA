import { useEffect, useRef } from "react";

export const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="https://cdn.pixabay.com/video/2022/05/20/117606-712421887_large.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/50">
        <div className="flex items-center justify-center h-full">
          <img
            src="/lovable-uploads/d7914495-21a4-4298-b790-e4f4e80f3df4.png"
            alt="MemeCatLandar Logo"
            className="w-[600px] h-[600px] object-contain animate-float"
          />
        </div>
      </div>
    </div>
  );
};