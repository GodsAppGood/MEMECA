import React from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

interface AuthTestResult {
  name: string;
  status: "pass" | "fail" | "manual";
  error?: string;
}

export const AuthTestModule = () => {
  const [results, setResults] = React.useState<AuthTestResult[]>([]);
  const [isRunning, setIsRunning] = React.useState(false);

  const runTests = async () => {
    setIsRunning(true);
    const testResults: AuthTestResult[] = [];

    try {
      // Test session management
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      testResults.push({
        name: "Session Management",
        status: !sessionError ? "pass" : "fail",
        error: sessionError?.message
      });

      // Test Google OAuth configuration
      testResults.push({
        name: "Google OAuth Setup",
        status: "manual",
        error: "Please verify OAuth configuration in Supabase dashboard"
      });

    } catch (error: any) {
      testResults.push({
        name: "Authentication Tests",
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
      <h3 className="text-lg font-semibold mb-2">Authentication Tests</h3>
      <button 
        onClick={runTests}
        className="bg-primary text-white px-4 py-2 rounded"
        disabled={isRunning}
      >
        {isRunning ? 'Running...' : 'Run Auth Tests'}
      </button>
      {results.length > 0 && (
        <div className="mt-4 space-y-2">
          {results.map((result, index) => (
            <div 
              key={index}
              className={`p-2 rounded ${
                result.status === 'pass' 
                  ? 'bg-green-100 text-green-800' 
                  : result.status === 'manual'
                  ? 'bg-yellow-100 text-yellow-800'
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