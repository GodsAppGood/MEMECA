import React from 'react';

export const AboutSection = () => {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold font-serif mb-8 text-center">About Project</h2>
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <div className="lg:w-1/2">
          <img
            src="/lovable-uploads/64675aff-6e69-4c08-ada3-33ce2e7497e7.png"
            alt="Project Features"
            className="w-full max-w-[500px] mx-auto rounded-lg shadow-lg"
          />
        </div>
        <div className="lg:w-1/2 prose prose-lg">
          <p className="lead">Minimum Viable Product designed to bring your creative and humorous ideas to life while fostering a vibrant community of meme enthusiasts. Here's what makes it unique:</p>
          <ul className="space-y-4">
            <li><strong>Top 200 Memes</strong>: A dynamic leaderboard showcasing the best memes based purely on community votes. Sponsored memes are clearly marked to maintain transparency.</li>
            <li><strong>Watchlist</strong>: Your personal space to save and revisit your favorite memes anytime.</li>
            <li><strong>Tuzemoon</strong>: A premium section for exclusive content that gets extra visibility and reach.</li>
            <li><strong>AI-Powered Features (Coming Soon)</strong>: An intelligent assistant to enhance your experience with recommendations and support.</li>
            <li><strong>Telegram Integration</strong>: All memes are automatically shared in our Telegram channel to spark conversations and extend reach.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};