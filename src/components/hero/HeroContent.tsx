export const HeroContent = () => {
  return (
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
  );
};