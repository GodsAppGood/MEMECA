import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

export function Watchlist() {
  // This is a placeholder component - will need to integrate with actual data
  const mockLikedMemes = [
    {
      id: 1,
      title: "Popular Meme",
      imageUrl: "/placeholder.svg",
      likes: 42,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-serif font-bold">My Watchlist</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockLikedMemes.map((meme) => (
          <Card key={meme.id}>
            <CardHeader>
              <CardTitle className="font-serif">{meme.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={meme.imageUrl} alt={meme.title} className="w-full h-48 object-cover rounded-md" />
              <div className="mt-2 flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-600">{meme.likes} likes</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}