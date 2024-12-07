import React from "react";
import { Card } from "./ui/card";

interface MemeGridProps {
  selectedDate?: Date;
  selectedBlockchain?: string;
}

export const MemeGrid: React.FC<MemeGridProps> = ({ selectedDate, selectedBlockchain }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={item} className="overflow-hidden">
            <img
              src={`https://placekitten.com/400/30${item}`}
              alt={`Meme ${item}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Funny Cat Meme {item}</h3>
              <p className="text-sm text-muted-foreground">
                Posted on {new Date().toLocaleDateString()}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};