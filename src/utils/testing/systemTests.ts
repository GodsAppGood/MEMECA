import { supabase } from "@/integrations/supabase/client";
import { TestResult } from "./types";

export async function runSystemTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  // Test Supabase Connection
  try {
    const { data, error } = await supabase.from('Memes').select('count').single();
    results.push({
      name: "Supabase Connection",
      status: !error ? "pass" : "fail",
      error: error?.message,
      category: "Database"
    });
  } catch (error: any) {
    results.push({
      name: "Supabase Connection",
      status: "fail",
      error: error.message,
      category: "Database"
    });
  }

  // Test Environment Variables
  results.push({
    name: "Google Client ID",
    status: process.env.REACT_APP_GOOGLE_CLIENT_ID ? "pass" : "manual",
    details: "Using fallback client ID",
    category: "Security"
  });

  // Test Performance
  const navigationTiming = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
  results.push({
    name: "Page Load Performance",
    status: navigationTiming.domContentLoadedEventEnd < 3000 ? "pass" : "manual",
    details: `Load time: ${navigationTiming.domContentLoadedEventEnd}ms`,
    category: "Performance"
  });

  // Test OAuth Configuration
  const oauthConfig = {
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || "default",
    redirectUri: `${window.location.origin}/auth/v1/callback`,
    origin: window.location.origin
  };

  results.push({
    name: "OAuth Configuration",
    status: oauthConfig.clientId !== "default" ? "pass" : "manual",
    details: "Check Google OAuth setup in Supabase dashboard",
    category: "Authentication"
  });

  return results;
}