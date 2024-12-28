import { useState } from "react";
import { runAuthTests } from "./authTests";
import { runDatabaseTests } from "./databaseTests";
import { runUITests } from "./uiTests";
import { TestResult, TestSummary, TestCategory } from "./types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export class TestRunner {
  private results: TestResult[] = [];

  async runAllTests() {
    try {
      // Run auth tests
      const authResults = await runAuthTests();
      this.results.push(...authResults);

      // Run database tests
      const dbResults = await runDatabaseTests();
      this.results.push(...dbResults);

      // Run UI tests
      const uiResults = runUITests();
      this.results.push(...uiResults);

      return this.getSummary();
    } catch (error: any) {
      console.error("Error running tests:", error);
      toast.error("Error running tests", {
        description: error.message
      });
      return this.getSummary();
    }
  }

  private getSummary(): TestSummary {
    const total = this.results.length;
    const passed = this.results.filter(r => r.status === "pass").length;
    const failed = this.results.filter(r => r.status === "fail").length;
    const manual = this.results.filter(r => r.status === "manual").length;

    return {
      total,
      passed,
      failed,
      manual,
      results: this.results
    };
  }
}

export const TestRunnerComponent = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [summary, setSummary] = useState<TestSummary | null>(null);

  const runTests = async () => {
    setIsRunning(true);
    const runner = new TestRunner();
    
    try {
      const results = await runner.runAllTests();
      setSummary(results);
      
      if (results.failed > 0) {
        toast.error(`${results.failed} tests failed`, {
          description: "Check the results for details"
        });
      } else {
        toast.success("All automated tests passed!", {
          description: `${results.passed} tests passed, ${results.manual} manual tests remaining`
        });
      }
    } catch (error: any) {
      console.error("Error running tests:", error);
      toast.error("Error running tests", {
        description: error.message
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "fail":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "manual":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const groupTestsByCategory = (results: TestResult[]) => {
    return results.reduce((acc, result) => {
      if (!acc[result.category]) {
        acc[result.category] = [];
      }
      acc[result.category].push(result);
      return acc;
    }, {} as Record<TestCategory, TestResult[]>);
  };

  return (
    <Card className="p-6 max-w-4xl mx-auto my-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Test Runner</h2>
        <Button 
          onClick={runTests} 
          disabled={isRunning}
          className="min-w-[120px]"
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            'Run Tests'
          )}
        </Button>
      </div>

      {summary && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold">{summary.total}</div>
              <div className="text-sm text-muted-foreground">Total Tests</div>
            </Card>
            <Card className="p-4 text-center bg-green-50">
              <div className="text-2xl font-bold text-green-600">{summary.passed}</div>
              <div className="text-sm text-green-600">Passed</div>
            </Card>
            <Card className="p-4 text-center bg-red-50">
              <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
              <div className="text-sm text-red-600">Failed</div>
            </Card>
            <Card className="p-4 text-center bg-yellow-50">
              <div className="text-2xl font-bold text-yellow-600">{summary.manual}</div>
              <div className="text-sm text-yellow-600">Manual Tests</div>
            </Card>
          </div>

          <div className="space-y-6">
            {Object.entries(groupTestsByCategory(summary.results)).map(([category, tests]) => (
              <div key={category} className="space-y-2">
                <h3 className="text-xl font-semibold mb-4">{category}</h3>
                <div className="space-y-2">
                  {tests.map((result, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border ${
                        result.status === 'fail' 
                          ? 'bg-red-50 border-red-200' 
                          : result.status === 'manual'
                          ? 'bg-yellow-50 border-yellow-200'
                          : 'bg-green-50 border-green-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(result.status)}
                          <span className="font-medium">{result.name}</span>
                        </div>
                        <span className="text-sm capitalize">{result.status}</span>
                      </div>
                      {(result.error || result.details) && (
                        <p className="mt-2 text-sm text-gray-600">
                          {result.error || result.details}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};