import { Card, CardContent, CardFooter } from "./ui/card";

const PLACEHOLDER_MEMES = [
  {
    id: 1,
    image: "https://placekitten.com/300/300",
    description: "Just another day in the blockchain...",
  },
  {
    id: 2,
    image: "https://placekitten.com/301/300",
    description: "When the gas fees are too high...",
  },
  {
    id: 3,
    image: "https://placekitten.com/300/301",
    description: "POV: Watching your portfolio...",
  },
];

export const MemeGrid = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PLACEHOLDER_MEMES.map((meme) => (
          <Card key={meme.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-2 border-primary/20">
            <CardContent className="p-0">
              <img
                src={meme.image}
                alt={meme.description}
                className="w-full h-64 object-cover"
              />
            </CardContent>
            <CardFooter className="p-4 bg-secondary/5">
              <p className="font-serif text-lg">{meme.description}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};