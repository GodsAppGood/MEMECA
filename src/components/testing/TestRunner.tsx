import React from "react";
import { Card } from "@/components/ui/card";
import { AuthTestModule } from "./modules/AuthTestModule";
import { DatabaseTestModule } from "./modules/DatabaseTestModule";
import { UITestModule } from "./modules/UITestModule";

export const TestRunnerComponent = () => {
  return (
    <Card className="p-6 max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4">System Test Runner</h2>
      <div className="space-y-4">
        <AuthTestModule />
        <DatabaseTestModule />
        <UITestModule />
      </div>
    </Card>
  );
};