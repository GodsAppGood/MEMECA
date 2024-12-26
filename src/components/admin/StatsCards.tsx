import { Card } from "@/components/ui/card";
import { Users, BarChart3 } from "lucide-react";

interface StatsCardsProps {
  userCount: number;
  memeCount: number;
}

export const StatsCards = ({ userCount, memeCount }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Users className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold">{userCount}</h2>
            <p className="text-gray-600">Total Users</p>
          </div>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <BarChart3 className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold">{memeCount}</h2>
            <p className="text-gray-600">Total Memes</p>
          </div>
        </div>
      </Card>
    </div>
  );
};