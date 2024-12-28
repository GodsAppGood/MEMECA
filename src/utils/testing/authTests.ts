import { supabase } from "@/integrations/supabase/client";
import { TestResult } from "./types";

export async function runAuthTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  try {
    // Test session management
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    results.push({
      name: "Session Management",
      status: !sessionError ? "pass" : "fail",
      error: sessionError?.message,
      category: "Authentication"
    });

    // Test user data retrieval
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    results.push({
      name: "User Profile Access",
      status: !userError ? "pass" : "fail",
      error: userError?.message,
      category: "Authentication"
    });

    // Test session refresh
    const { error: refreshError } = await supabase.auth.refreshSession();
    results.push({
      name: "Session Refresh",
      status: !refreshError ? "pass" : "fail",
      error: refreshError?.message,
      category: "Authentication"
    });

  } catch (error: any) {
    console.error("Auth tests error:", error);
    results.push({
      name: "Authentication System",
      status: "fail",
      error: error.message,
      category: "Authentication"
    });
  }

  return results;
}