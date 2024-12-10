import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Support } from "@/components/Support";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyMemes = () => {
  const navigate = useNavigate();

  const { data: memes } = useQuery({
    queryKey: ["memes"],
    queryFn: () => {
      const storedMemes = JSON.parse(localStorage.getItem("memes") || "[]");
      const userId = "current-user-id"; // This should be replaced with actual user ID
      return storedMemes.filter((meme: any) => meme.userId === userId);
    },
  });

  const handleEdit = (meme: any) => {
    localStorage.setItem("editingMeme", JSON.stringify(meme));
    navigate("/submit");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold mb-8">My Memes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memes?.map((meme: any) => (
            <Card key={meme.id} className="overflow-hidden">
              <CardHeader className="space-y-1">
                <div className="flex justify-between items-start">
                  <CardTitle className="font-serif">{meme.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(meme)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <img
                  src={meme.imageUrl}
                  alt={meme.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <p className="mt-2 text-sm text-gray-600">{meme.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Support />
      <Footer />
    </div>
  );
};

export default MyMemes;