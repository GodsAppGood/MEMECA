import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

export const TransactionHistory = () => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions-history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("TransactionLogs")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading transaction history...</div>;
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
      <ScrollArea className="h-[300px]">
        {transactions?.map((tx) => (
          <div
            key={tx.id}
            className="flex items-start space-x-3 p-3 border-b last:border-0"
          >
            {tx.transaction_status === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : tx.transaction_status === "pending" ? (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="font-medium">
                  {tx.amount} SOL
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(tx.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {tx.transaction_signature ? 
                  `Signature: ${tx.transaction_signature.slice(0, 8)}...` : 
                  tx.error_message || "Transaction pending"}
              </p>
            </div>
          </div>
        ))}
      </ScrollArea>
    </Card>
  );
};