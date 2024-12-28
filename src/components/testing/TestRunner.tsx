import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TestRunner as TestRunnerUtil } from "@/utils/testing/TestRunner";
import { Loader2 } from "lucide-react";

export const TestRunner = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const runTests = async () => {
    setIsRunning(true);
    const runner = new TestRunnerUtil();

    try {
      await runner.runAuthTests();
      await runner.runDatabaseTests();
      runner.runUITests();
      
      const testResults = runner.getResults();
      setResults(testResults);
      runner.printSummary();
    } catch (error) {
      console.error("Error running tests:", error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4">Test Runner</h2>
      
      <Button 
        onClick={runTests} 
        disabled={isRunning}
        className="mb-4"
      >
        {isRunning ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Running Tests...
          </>
        ) : (
          'Run Tests'
        )}
      </Button>

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Results:</h3>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg ${
                  result.status === 'pass' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}
              >
                <p className="font-medium">{result.name}: {result.status.toUpperCase()}</p>
                {result.error && (
                  <p className="text-sm mt-1">{result.error}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};