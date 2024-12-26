import React from 'react';

export const RoadmapSection = () => {
  return (
    <section className="mb-12">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-1/2">
          <img
            src="/lovable-uploads/9d9a7503-4add-4cac-ad58-bf4c5e6174c7.png"
            alt="Tuzemoon Mascot"
            className="w-full h-auto rounded-lg shadow-lg mx-auto animate-float"
            loading="lazy"
          />
        </div>
        <div className="w-full lg:w-1/2 prose prose-sm sm:prose-base lg:prose-lg max-w-none">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif mb-6">Tuzemoon RoadMap</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">1. Listing on Dexscreener</h3>
              <p className="text-base sm:text-lg">Immediately after launch, the token will be listed on Dexscreener with liquidity pool support, allowing investors to easily track its price and trading volumes.</p>
            </div>
            
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">2. Regular Platform Updates</h3>
              <p className="text-base sm:text-lg">The platform will be regularly updated to improve functionality and design. Our goal is to make the website user-friendly and valuable for all users.</p>
            </div>
            
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">3. Integration of an AI Assistant</h3>
              <p className="text-base sm:text-lg">We plan to integrate our own AI assistant, which will:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li className="text-base sm:text-lg">Analyze tokens, providing detailed insights into their potential.</li>
                <li className="text-base sm:text-lg">Evaluate new blockchain-based projects.</li>
                <li className="text-base sm:text-lg">Offer trading recommendations and guidance on adding tokens to portfolios.</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">4. Fully Automated Platform</h3>
              <p className="text-base sm:text-lg">In the future, we aim to make the platform completely automated for seamless user experience and efficiency.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};