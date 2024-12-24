import React from 'react';

export const WelcomeSection = () => {
  return (
    <section className="mb-12">
      <h1 className="text-4xl font-bold font-serif mb-8 text-center">Welcome to MemeCatLandar!</h1>
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <div className="lg:w-1/2">
          <img
            src="/lovable-uploads/687016b8-6c47-4357-9f3f-b4af5d2da3a7.png"
            alt="Project Illustration"
            className="w-full max-w-[500px] mx-auto rounded-lg shadow-lg"
          />
        </div>
        <div className="lg:w-1/2 prose prose-lg">
          <p>Hi, my name is Ann Ostrovsky, and I am absolutely delighted to have you here! Let me share the story behind this project—a labor of love, creativity, and community.</p>
          <p>In today's fast-paced digital world, memes are everywhere, but they fade as quickly as they rise. Finding the right space to share a meme, grow a community, and leave a lasting impact can feel like an impossible mission. That's where MemeCatLandar comes in—a unique platform where memes are given the spotlight they deserve, and creators can build their legacy.</p>
          <p>Guided by Memeca, our fearless, toilet-riding space adventurer, this platform travels across the infinite galaxy of memes, bringing together creators and audiences. Here, everyone has the opportunity to craft their own meme card, launch their ideas, and connect with the world.</p>
        </div>
      </div>
    </section>
  );
};