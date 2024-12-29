import React from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

interface DatabaseTestResult {
  name: string;
  status: "pass" | "fail";
  error?: string;
}

export const DatabaseTestModule = () => {
  const [results, setResults] = React.useState<DatabaseTestResult[]>([]);
  const [isRunning, setIsRunning] = React.useState(false);

  const runTests = async () => {
    setIsRunning(true);
    const testResults: DatabaseTestResult[] = [];

    try {
      // Test database connection
      const { data, error } = await supabase
        .from('Memes')
        .select('count');

      testResults.push({
        name: "Database Connection",
        status: !error ? "pass" : "fail",
        error: error?.message
      });

    } catch (error: any) {
      testResults.push({
        name: "Database Tests",
        status: "fail",
        error: error.message
      });
    }

    setResults(testResults);
    setIsRunning(false);
    return testResults;
  };

  return (
    <Card className="p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">Database Tests</h3>
      <button 
        onClick={runTests}
        className="bg-primary text-white px-4 py-2 rounded"
        disabled={isRunning}
      >
        {isRunning ? 'Running...' : 'Run Database Tests'}
      </button>
      {results.length > 0 && (
        <div className="mt-4 space-y-2">
          {results.map((result, index) => (
            <div 
              key={index}
              className={`p-2 rounded ${
                result.status === 'pass' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}
            >
              <p>{result.name}: {result.status}</p>
              {result.error && <p className="text-sm">{result.error}</p>}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};