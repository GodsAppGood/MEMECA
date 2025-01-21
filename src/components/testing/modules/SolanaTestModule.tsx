import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export const SolanaTestModule = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Starting Solana test...');
      
      const { data, error: functionError } = await supabase.functions.invoke('test-solscan');
      
      if (functionError) throw functionError;
      
      console.log('Test result:', data);
      setResult(data);
    } catch (err: any) {
      console.error('Test error:', err);
      setError(err.message || 'An error occurred during testing');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-medium">Solana Integration Test</h3>
      
      <Button 
        onClick={handleTest}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Testing...
          </>
        ) : (
          'Test Solana Integration'
        )}
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="mt-4 p-4 bg-secondary rounded-lg">
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};