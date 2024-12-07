export const Hero = () => {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Video Background */}
      <div className="h-[70vh]">
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
        <div className="relative container mx-auto h-full flex flex-col items-center justify-center">
          <h1 className="text-6xl font-serif text-white mb-8">MemeCatLandar</h1>
          <img
            src="/lovable-uploads/d7914495-21a4-4298-b790-e4f4e80f3df4.png"
            alt="MemeCatLandar Logo"
            className="w-[1000px] h-[1000px] object-contain animate-float"
          />
        </div>
      </div>

      {/* Steps Section */}
      <div className="bg-white py-12">
        <h2 className="text-4xl font-serif text-center mb-12">3 Simple Steps</h2>
        <div className="container mx-auto flex justify-center gap-24">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-serif">1</div>
            <p className="mt-4 text-lg font-serif">Sign Up</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-serif">2</div>
            <p className="mt-4 text-lg font-serif">Create Memes</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-serif">3</div>
            <p className="mt-4 text-lg font-serif">Share & Enjoy</p>
          </div>
        </div>
      </div>
    </div>
  );
};