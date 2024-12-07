import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

export function ReferralProgram() {
  // This is a placeholder component - will need to integrate with actual data
  const referralLink = "https://meowmemes.com/ref/123456";
  const points = 100;
  const referrals = [
    {
      id: 1,
      name: "John Doe",
      registrationDate: "2024-03-07",
    },
  ];

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    // Add toast notification here
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
          <p className="text-sm text-gray-600 mt-2">Points can be used for paid likes</p>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((referral) => (
                <TableRow key={referral.id}>
                  <TableCell>{referral.name}</TableCell>
                  <TableCell>{referral.registrationDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}