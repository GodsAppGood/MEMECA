import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TestResult {
  name: string;
  status: 'pass' | 'fail';
  error?: string;
  details?: string;
}

interface TestCase {
  name: string;
  run: () => Promise<void>;
}

export class TestRunner {
  private results: TestResult[] = [];

  async runAuthTests() {
    const authTests: TestCase[] = [
      {
        name: "Session Management",
        run: async () => {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) throw new Error(`Session test failed: ${error.message}`);
          console.log("Current session:", session);
        }
      },
      {
        name: "User Profile",
        run: async () => {
          const { data: { user }, error } = await supabase.auth.getUser();
          if (error) throw new Error(`Profile test failed: ${error.message}`);
          console.log("Current user:", user);
        }
      }
    ];

    for (const test of authTests) {
      try {
        await test.run();
        this.logResult({ name: test.name, status: 'pass' });
      } catch (error: any) {
        this.logResult({ 
          name: test.name, 
          status: 'fail', 
          error: error.message 
        });
      }
    }
  }

  async runDatabaseTests() {
    const dbTests: TestCase[] = [
      {
        name: "Memes Table Access",
        run: async () => {
          const { data, error } = await supabase
            .from('Memes')
            .select('*')
            .limit(1);
          if (error) throw new Error(`Memes table test failed: ${error.message}`);
          console.log("Memes table access:", data);
        }
      },
      {
        name: "Users Table Access",
        run: async () => {
          const { data, error } = await supabase
            .from('Users')
            .select('*')
            .limit(1);
          if (error) throw new Error(`Users table test failed: ${error.message}`);
          console.log("Users table access:", data);
        }
      }
    ];

    for (const test of dbTests) {
      try {
        await test.run();
        this.logResult({ name: test.name, status: 'pass' });
      } catch (error: any) {
        this.logResult({ 
          name: test.name, 
          status: 'fail', 
          error: error.message 
        });
      }
    }
  }

  async runUITests() {
    // These tests will need to be run manually as they involve visual inspection
    const uiTestChecklist = [
      "Verify all buttons are clickable and properly styled",
      "Check responsive design on different screen sizes",
      "Ensure modals open and close correctly",
      "Verify form validation messages appear correctly",
      "Check loading states are displayed appropriately"
    ];

    uiTestChecklist.forEach(test => {
      console.log(`UI Test: ${test}`);
    });
  }

  private logResult(result: TestResult) {
    this.results.push(result);
    console.log(`Test: ${result.name} - ${result.status.toUpperCase()}`);
    if (result.error) {
      console.error(`Error: ${result.error}`);
      toast.error(`Test failed: ${result.name}`, {
        description: result.error
      });
    } else {
      toast.success(`Test passed: ${result.name}`);
    }
  }

  getResults() {
    return this.results;
  }

  printSummary() {
    const total = this.results.length;
    const passed = this.results.filter(r => r.status === 'pass').length;
    const failed = total - passed;

    console.log('\nTest Summary:');
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);

    if (failed > 0) {
      console.log('\nFailed Tests:');
      this.results
        .filter(r => r.status === 'fail')
        .forEach(r => {
          console.log(`- ${r.name}: ${r.error}`);
        });
    }
  }
}