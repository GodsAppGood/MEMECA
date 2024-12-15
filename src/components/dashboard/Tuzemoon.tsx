import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Tuzemoon() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-serif font-bold">Tuzemoon</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Welcome to Tuzemoon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-600">
            This page is under construction. Stay tuned for exciting updates!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}