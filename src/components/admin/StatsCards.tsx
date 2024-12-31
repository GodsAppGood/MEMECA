import { Users, Clock, ChartBar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export const StatsCards = () => {
  const [activeUsers, setActiveUsers] = useState(0);

  // Query for total users
  const { data: totalUsers = 0 } = useQuery({
    queryKey: ["total-users"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("Users")
        .select("*", { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  // Query for users today
  const { data: usersToday = 0 } = useQuery({
    queryKey: ["users-today"],
    queryFn: async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { data, error } = await supabase
        .from("Sessions")
        .select('user_id')
        .gte('created_at', yesterday.toISOString());
      
      if (error) throw error;
      
      // Get unique user_ids using Set
      const uniqueUserIds = new Set(data.map(session => session.user_id));
      return uniqueUserIds.size;
    }
  });

  // Set up realtime subscription for active users
  useEffect(() => {
    const channel = supabase.channel('active-users')
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const uniqueUsers = new Set(
          Object.values(presenceState)
            .flat()
            .map((presence: any) => presence.user_id)
        );
        setActiveUsers(uniqueUsers.size);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users Now</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeUsers}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Users Today</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{usersToday}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <ChartBar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
        </CardContent>
      </Card>
    </div>
  );
};