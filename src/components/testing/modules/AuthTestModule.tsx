import React from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface AuthTestResult {
  name: string;
  status: "pass" | "fail" | "manual";
  error?: string;
  details?: string;
}

interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  origin: string;
}

export const AuthTestModule = () => {
  const [results, setResults] = React.useState<AuthTestResult[]>([]);
  const [isRunning, setIsRunning] = React.useState(false);
  const { toast } = useToast();

  const validateRedirectUri = (uri: string): boolean => {
    try {
      const url = new URL(uri);
      return url.protocol === 'https:' || url.hostname === 'localhost';
    } catch {
      return false;
    }
  };

  const checkOAuthConfig = (): OAuthConfig => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/v1/callback`;
    const origin = window.location.origin;

    console.log('OAuth Configuration:', {
      clientId,
      redirectUri,
      origin,
      environment: import.meta.env.MODE,
      allowedDomains: [
        'memecatlandar.io',
        'www.memecatlandar.io',
        window.location.hostname
      ]
    });

    return { clientId, redirectUri, origin };
  };

  const runTests = async () => {
    setIsRunning(true);
    const testResults: AuthTestResult[] = [];
    const oauthConfig = checkOAuthConfig();

    try {
      // Test session management
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      testResults.push({
        name: "Session Management",
        status: !sessionError ? "pass" : "fail",
        error: sessionError?.message,
        details: session ? "Active session found" : "No active session"
      });

      // Test OAuth Configuration
      testResults.push({
        name: "Google OAuth Client ID",
        status: oauthConfig.clientId ? "pass" : "fail",
        error: !oauthConfig.clientId ? "Missing Google Client ID" : undefined,
        details: `Client ID: ${oauthConfig.clientId ? "Configured" : "Missing"}`
      });

      // Validate Redirect URI
      const isValidRedirectUri = validateRedirectUri(oauthConfig.redirectUri);
      testResults.push({
        name: "Redirect URI Validation",
        status: isValidRedirectUri ? "pass" : "fail",
        error: !isValidRedirectUri ? "Invalid redirect URI format" : undefined,
        details: `URI: ${oauthConfig.redirectUri}`
      });

      // Test CORS and Origin
      testResults.push({
        name: "CORS Configuration",
        status: "manual",
        details: `Origin: ${oauthConfig.origin}\nVerify in Google Console & Supabase settings`
      });

      // Network Request Test
      try {
        const response = await fetch(`${oauthConfig.origin}/auth/v1/callback`, {
          method: 'HEAD'
        });
        testResults.push({
          name: "Callback Endpoint",
          status: response.ok ? "pass" : "manual",
          details: `Status: ${response.status} ${response.statusText}`
        });
      } catch (error: any) {
        testResults.push({
          name: "Callback Endpoint",
          status: "fail",
          error: error.message
        });
      }

    } catch (error: any) {
      console.error("Auth tests error:", error);
      testResults.push({
        name: "Authentication System",
        status: "fail",
        error: error.message
      });
    }

    setResults(testResults);
    setIsRunning(false);

    // Log comprehensive results
    console.log('Auth Test Results:', {
      timestamp: new Date().toISOString(),
      environment: import.meta.env.MODE,
      results: testResults,
      oauthConfig
    });

    return testResults;
  };

  return (
    <Card className="p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">Authentication Tests</h3>
      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-600">
          Tests OAuth configuration, session management, and redirect URIs.
        </p>
        <button 
          onClick={runTests}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
          disabled={isRunning}
        >
          {isRunning ? 'Running...' : 'Run Auth Tests'}
        </button>
      </div>
      
      {results.length > 0 && (
        <div className="mt-4 space-y-2">
          {results.map((result, index) => (
            <div 
              key={index}
              className={`p-3 rounded ${
                result.status === 'pass' 
                  ? 'bg-green-100 text-green-800' 
                  : result.status === 'manual'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              <p className="font-medium">{result.name}: {result.status}</p>
              {result.error && (
                <p className="text-sm mt-1 text-red-600">{result.error}</p>
              )}
              {result.details && (
                <p className="text-sm mt-1 opacity-80">{result.details}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};