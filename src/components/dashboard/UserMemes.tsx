import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, ExternalLink } from "lucide-react";

interface Meme {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  dateAdded: string;
  blockchain: string;
  tradeLink?: string;
  userId: string;
}

export function UserMemes() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedMemes = JSON.parse(localStorage.getItem("memes") || "[]");
    // Filter memes by current user ID (this should be replaced with actual user ID check)
    const userMemes = storedMemes.filter((meme: Meme) => meme.userId === "current-user-id");
    setMemes(userMemes);
  }, []);

  const handleEdit = (meme: Meme) => {
    // Store the meme being edited in localStorage
    localStorage.setItem("editingMeme", JSON.stringify(meme));
    navigate("/submit");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-serif font-bold">My Memes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memes.map((meme) => (
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
              <img src={meme.imageUrl} alt={meme.title} className="w-full h-48 object-cover rounded-md mb-4" />
              <p className="mt-2 text-sm text-gray-600">{meme.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-500">Added on: {meme.dateAdded}</span>
                {meme.tradeLink && (
                  <a
                    href={meme.tradeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-primary hover:underline"
                  >
                    Trade <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};