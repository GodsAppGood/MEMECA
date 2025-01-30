import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Memeca AI Platform</h1>
        <p className="text-lg mb-8">
          Looks like you've stumbled upon a black hole in the meme galaxy. Let's get you back on track!
        </p>
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