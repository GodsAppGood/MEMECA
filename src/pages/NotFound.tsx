import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome on MeMeCa Planet</h1>
        <p className="text-lg mb-8">
          Looks like you've stumbled upon a black hole in the meme galaxy. Let's get you back on track!
        </p>
        <div className="my-8">
          <img 
            src="/lovable-uploads/fe326afe-8ae8-4f57-9ce1-a69eaca23ce2.png"
            alt="404 Meme Cat"
            className="max-w-full h-auto mx-auto rounded-lg"
            style={{ maxHeight: '400px' }}
          />
        </div>
        <Link to="/">
          <Button variant="default">
            <Home className="mr-2 h-4 w-4" />
            Return Home
          </Button>
        </Link>
      </div>
    </MainLayout>
  );
};

export default NotFound;