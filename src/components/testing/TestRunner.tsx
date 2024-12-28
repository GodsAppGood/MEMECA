import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TestResult {
  name: string;
  status: "pass" | "fail" | "manual";
  error?: string;
  details?: string;
}

export class TestRunner {
  private results: TestResult[] = [];

  async runAuthTests() {
    try {
      // Test anonymous access
      const { data: publicData, error: publicError } = await supabase
        .from('Memes')
        .select('*')
        .limit(1);

      this.results.push({
        name: "Public Access to Memes",
        status: !publicError ? "pass" : "fail",
        error: publicError?.message
      });

      // Test authentication
      const { data: session } = await supabase.auth.getSession();
      this.results.push({
        name: "Session Management",
        status: session ? "pass" : "manual",
        details: "Please verify that login/logout functionality works correctly"
      });

      return this.results;
    } catch (error: any) {
      console.error("Auth test error:", error);
      this.results.push({
        name: "Authentication Tests",
        status: "fail",
        error: error.message
      });
      return this.results;
    }
  }

  async runDatabaseTests() {
    try {
      // Test database connection
      const { data, error } = await supabase
        .from('Memes')
        .select('count');

      this.results.push({
        name: "Database Connection",
        status: !error ? "pass" : "fail",
        error: error?.message
      });

      return this.results;
    } catch (error: any) {
      console.error("Database test error:", error);
      this.results.push({
        name: "Database Tests",
        status: "fail",
        error: error.message
      });
      return this.results;
    }
  }

  runUITests() {
    // Add manual UI test cases
    this.results.push({
      name: "Responsive Design",
      status: "manual",
      details: "Verify that the UI is responsive across different screen sizes"
    });

    this.results.push({
      name: "Navigation",
      status: "manual",
      details: "Verify that all navigation links work correctly"
    });

    return this.results;
  }

  getResults() {
    return this.results;
  }

  printSummary() {
    const total = this.results.length;
    const passed = this.results.filter(r => r.status === "pass").length;
    const failed = this.results.filter(r => r.status === "fail").length;
    const manual = this.results.filter(r => r.status === "manual").length;

    console.log(`
      Test Summary:
      Total Tests: ${total}
      Passed: ${passed}
      Failed: ${failed}
      Manual Tests: ${manual}
    `);

    return {
      total,
      passed,
      failed,
      manual
    };
  }
}

export const TestRunnerComponent: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const runTests = async () => {
    setIsRunning(true);
    const runner = new TestRunner();

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