import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Support } from "@/components/Support";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ReferralProgram = () => {
  const { toast } = useToast();
  const userId = "current-user-id"; // This should be replaced with actual user ID
  const referralLink = `${window.location.origin}/referral?user_id=${userId}`;
  const points = 100; // This should be replaced with actual points calculation
  const referrals = [
    {
      id: 1,
      name: "John Doe",
      registrationDate: "2024-03-07",
      points: 50,
    },
  ];

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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold mb-8">Referral Program</h1>
        
        <div className="space-y-8">
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
                  className="flex-1 p-2 border rounded-md bg-gray-50"
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
                    <TableHead>Points Earned</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referrals.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell>{referral.name}</TableCell>
                      <TableCell>{referral.registrationDate}</TableCell>
                      <TableCell>{referral.points}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      <Support />
      <Footer />
    </div>
  );
};

export default ReferralProgram;