import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dpybiegurkiqwponvxac.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRweWJpZWd1cmtpcXdwb252eGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4NjMyNTIsImV4cCI6MjA0OTQzOTI1Mn0.QcS_OgLbaAU9tizKAXSgFpGj9MuqinatzmAPwUHl4hI";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'X-Client-Info': 'lovable-app'
    }
  }
});