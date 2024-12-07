import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UserMemes() {
  // This is a placeholder component - will need to integrate with actual data
  const mockMemes = [
    {
      id: 1,
      title: "First Meme",
      description: "A funny cat meme",
      imageUrl: "/placeholder.svg",
      dateAdded: "2024-03-07",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-serif font-bold">My Memes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockMemes.map((meme) => (
          <Card key={meme.id}>
            <CardHeader>
              <CardTitle className="font-serif">{meme.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={meme.imageUrl} alt={meme.title} className="w-full h-48 object-cover rounded-md" />
              <p className="mt-2 text-sm text-gray-600">{meme.description}</p>
              <p className="mt-2 text-xs text-gray-500">Added on: {meme.dateAdded}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}