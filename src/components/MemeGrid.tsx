import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useQuery } from "@tanstack/react-query";

export const MemeGrid = () => {
  const { data: memes = [] } = useQuery({
    queryKey: ["memes"],
    queryFn: () => JSON.parse(localStorage.getItem("memes") || "[]"),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {memes.map((meme: any) => (
          <Link to={`/meme/${meme.id}`} key={meme.id}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-2 border-primary/20">
              <CardContent className="p-0">
                <img
                  src={meme.imageUrl}
                  alt={meme.title}
                  className="w-full h-64 object-cover"
                />
              </CardContent>
              <CardFooter className="p-4 bg-secondary/5">
                <div>
                  <h3 className="font-serif text-lg mb-2">{meme.title}</h3>
                  <p className="text-sm text-gray-600">{meme.description}</p>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};