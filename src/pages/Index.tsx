import React from "react";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { WizardProvider } from "@/components/wizard/WizardContext";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <WizardProvider>
        <OnboardingWizard />
      </WizardProvider>
    </div>
  );
};

export default Index;