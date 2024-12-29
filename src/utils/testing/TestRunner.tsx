import { useState, useEffect } from "react";
import { runAuthTests } from "./authTests";
import { runSystemTests } from "./systemTests";
import { TestResult, TestSummary } from "./types";

export const TestRunner = () => {
  const [summary, setSummary] = useState<TestSummary>({
    total: 0,
    passed: 0,
    failed: 0,
    manual: 0,
    results: []
  });

  useEffect(() => {
    const runTests = async () => {
      console.log("Starting system tests...");
      
      try {
        const [authResults, systemResults] = await Promise.all([
          runAuthTests(),
          runSystemTests()
        ]);

        const allResults = [...authResults, ...systemResults];
        
        const summary = {
          total: allResults.length,
          passed: allResults.filter(r => r.status === "pass").length,
          failed: allResults.filter(r => r.status === "fail").length,
          manual: allResults.filter(r => r.status === "manual").length,
          results: allResults
        };

        console.log("Test summary:", summary);
        setSummary(summary);
      } catch (error) {
        console.error("Error running tests:", error);
      }
    };

    runTests();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">System Test Results</h2>
      
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-gray-100 rounded">
          <p className="text-lg font-semibold">Total Tests</p>
          <p className="text-3xl">{summary.total}</p>
        </div>
        <div className="p-4 bg-green-100 rounded">
          <p className="text-lg font-semibold">Passed</p>
          <p className="text-3xl text-green-600">{summary.passed}</p>
        </div>
        <div className="p-4 bg-red-100 rounded">
          <p className="text-lg font-semibold">Failed</p>
          <p className="text-3xl text-red-600">{summary.failed}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded">
          <p className="text-lg font-semibold">Manual Check</p>
          <p className="text-3xl text-yellow-600">{summary.manual}</p>
        </div>
      </div>

      <div className="space-y-4">
        {summary.results.map((result, index) => (
          <div 
            key={index}
            className={`p-4 rounded ${
              result.status === "pass" 
                ? "bg-green-50" 
                : result.status === "fail"
                ? "bg-red-50"
                : "bg-yellow-50"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{result.name}</h3>
                <p className="text-sm text-gray-600">{result.category}</p>
              </div>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  result.status === "pass"
                    ? "bg-green-100 text-green-800"
                    : result.status === "fail"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {result.status.toUpperCase()}
              </span>
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
  );
};