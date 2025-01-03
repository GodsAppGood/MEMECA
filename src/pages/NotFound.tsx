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
          The page you're looking for doesn't exist or has been moved.
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