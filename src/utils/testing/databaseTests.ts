import { supabase } from "@/integrations/supabase/client";
import { TestResult } from "./types";

export async function runDatabaseTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  try {
    // Test Memes table access
    const { data: memes, error: memesError } = await supabase
      .from('Memes')
      .select('*')
      .limit(1);
    results.push({
      name: "Memes Table Access",
      status: !memesError ? "pass" : "fail",
      error: memesError?.message,
      category: "Database"
    });

    // Test Users table access
    const { data: users, error: usersError } = await supabase
      .from('Users')
      .select('*')
      .limit(1);
    results.push({
      name: "Users Table Access",
      status: !usersError ? "pass" : "fail",
      error: usersError?.message,
      category: "Database"
    });

    // Test Likes table access
    const { data: likes, error: likesError } = await supabase
      .from('Likes')
      .select('*')
      .limit(1);
    results.push({
      name: "Likes Table Access",
      status: !likesError ? "pass" : "fail",
      error: likesError?.message,
      category: "Database"
    });

    // Test Watchlist table access
    const { data: watchlist, error: watchlistError } = await supabase
      .from('Watchlist')
      .select('*')
      .limit(1);
    results.push({
      name: "Watchlist Table Access",
      status: !watchlistError ? "pass" : "fail",
      error: watchlistError?.message,
      category: "Database"
    });

  } catch (error: any) {
    console.error("Database tests error:", error);
    results.push({
      name: "Database System",
      status: "fail",
      error: error.message,
      category: "Database"
    });
  }

  return results;
}