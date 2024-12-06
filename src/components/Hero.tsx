export const Hero = () => {
  return (
    <div className="relative h-[60vh] bg-secondary overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] bg-[length:50px_50px] opacity-20"></div>
      </div>
      <div className="relative container mx-auto h-full flex flex-col items-center justify-center">
        <img
          src="/lovable-uploads/28357d75-d362-4c2f-8653-5eec16d19c13.png"
          alt="MemeCatLandar Logo"
          className="w-64 h-64 object-contain animate-float"
        />
        <h1 className="text-6xl font-serif text-primary mt-8">MemeCatLandar</h1>
      </div>
    </div>
  );
};