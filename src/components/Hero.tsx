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
        className="absolute top-0 left-0 min-w-full min-h-full w-auto h-auto object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="https://cdn.pixabay.com/video/2022/05/20/117606-712421887_large.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black/50">
        <img 
          src="/lovable-uploads/94d67f05-71a5-4118-8daa-dde5461b41f4.png"
          alt="MemeCatndar Logo"
          className="absolute top-10 left-1/2 transform -translate-x-1/2 w-[80%] max-w-[800px] z-10"
        />
        <div className="flex items-center justify-center h-full">
          <img
            src="/lovable-uploads/4b2ce54e-e40a-4877-b49a-fb1d71a232f3.png"
            alt="Main Cat"
            className="w-[600px] h-[600px] object-contain animate-float"
          />
        </div>
      </div>
    </div>
  );
};