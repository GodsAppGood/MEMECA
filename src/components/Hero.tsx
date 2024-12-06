export const Hero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="https://cdn.pixabay.com/video/2022/05/20/117606-712421887_large.mp4" type="video/mp4" />
      </video>
      
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Content */}
      <div className="relative container mx-auto h-full flex flex-col items-center justify-center gap-8">
        <h1 className="text-6xl font-serif text-white">MemeCatLandar</h1>
        <img
          src="/lovable-uploads/87184899-3fb7-4bcc-bad1-19e67505da5c.png"
          alt="MemeCatLandar Logo"
          className="w-64 h-64 object-contain animate-float"
        />
      </div>
    </div>
  );
};