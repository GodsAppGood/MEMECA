import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export function ReferralProgram() {
  const { toast } = useToast();
  const userId = "current-user-id"; // This should be replaced with actual user ID
  
  const { data: points = 0 } = useQuery({
    queryKey: ["user-points", userId],
    queryFn: () => {
      return parseInt(localStorage.getItem(`points-${userId}`) || "100");
    }
  });

  const { data: referrals = [] } = useQuery({
    queryKey: ["referrals", userId],
    queryFn: () => {
      return JSON.parse(localStorage.getItem(`referrals-${userId}`) || "[]");
    }
  });
  
  const referralLink = `${window.location.origin}/ref/${userId}`;

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast({
        title: "Success",
        description: "Referral link copied to clipboard",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy referral link",
      });
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-serif font-bold">Referral Program</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Your Points</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{points}</p>
          <p className="text-sm text-gray-600 mt-2">
            {points === 0 ? (
              <span className="text-red-500">
                You're out of points! Invite friends to earn more.
              </span>
            ) : points <= 10 ? (
              <span className="text-yellow-500">
                You're running low on points! Invite friends to earn more.
              </span>
            ) : (
              "Points can be used for likes"
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Your Referral Link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 p-2 border rounded-md"
            />
            <Button onClick={copyReferralLink} variant="outline" size="icon">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Share this link and earn 10 points for each new user who registers!
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Your Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Points Earned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((referral: any) => (
                <TableRow key={referral.id}>
                  <TableCell>{referral.name}</TableCell>
                  <TableCell>{referral.registrationDate}</TableCell>
                  <TableCell>+{referral.pointsEarned}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}