import React from "react";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { WizardProvider } from "@/components/wizard/WizardContext";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <WizardProvider>
          <OnboardingWizard />
        </WizardProvider>
      </div>
    </div>
  );
};

export default Index;