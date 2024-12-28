export type TestStatus = "pass" | "fail" | "manual";

export type TestCategory = 
  | "Authentication" 
  | "Database" 
  | "UI/UX" 
  | "Performance" 
  | "Security";

export interface TestResult {
  name: string;
  status: TestStatus;
  error?: string;
  details?: string;
  category: TestCategory;
}

export interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  manual: number;
  results: TestResult[];
}