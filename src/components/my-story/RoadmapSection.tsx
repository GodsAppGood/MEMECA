import React from 'react';

export const RoadmapSection = () => {
  return (
    <section className="mb-12">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="lg:w-1/2">
          <img
            src="/lovable-uploads/9d9a7503-4add-4cac-ad58-bf4c5e6174c7.png"
            alt="Tuzemoon Mascot"
            className="w-full max-w-[500px] mx-auto rounded-lg shadow-lg animate-float"
          />
        </div>
        <div className="lg:w-1/2 prose prose-lg">
          <h2 className="text-3xl font-bold font-serif mb-6">Tuzemoon RoadMap</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">1. Listing on Dexscreener</h3>
              <p>Immediately after launch, the token will be listed on Dexscreener with liquidity pool support, allowing investors to easily track its price and trading volumes.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">2. Regular Platform Updates</h3>
              <p>The platform will be regularly updated to improve functionality and design. Our goal is to make the website user-friendly and valuable for all users.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">3. Integration of an AI Assistant</h3>
              <p>We plan to integrate our own AI assistant, which will:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Analyze tokens, providing detailed insights into their potential.</li>
                <li>Evaluate new blockchain-based projects.</li>
                <li>Offer trading recommendations and guidance on adding tokens to portfolios.</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">4. Fully Automated Platform</h3>
              <p>In the future, we aim to make the platform completely automated for seamless user experience and efficiency.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};