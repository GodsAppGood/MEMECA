import { Header } from "@/components/Header";
import { Support } from "@/components/Support";
import { Footer } from "@/components/Footer";

const MyStory = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold font-serif mb-8 text-center">My Story</h1>
          
          <div className="prose prose-lg mx-auto">
            <p className="mb-6">
              Welcome to Meow Meme Land! This platform was created with a simple vision: 
              to bring together meme enthusiasts and creators in a fun, engaging environment.
            </p>
            
            <p className="mb-6">
              Our journey began with a passion for memes and blockchain technology. 
              We wanted to create a space where creativity meets community, where every 
              meme tells a story, and where creators can share their work with the world.
            </p>

            <p className="mb-6">
              Today, we're proud to offer a platform that celebrates creativity, 
              humor, and the unique culture of the internet. Whether you're here 
              to share your memes, discover new content, or just enjoy the 
              community, we're glad you're part of our story.
            </p>
          </div>
        </div>
      </main>
      <Support />
      <Footer />
    </div>
  );
};

export default MyStory;