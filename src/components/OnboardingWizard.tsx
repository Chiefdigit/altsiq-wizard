import React from "react";
import { Accordion } from "@/components/ui/accordion";
import { PortfolioStep } from "./wizard/PortfolioStep";
import { AllocationStep } from "./wizard/AllocationStep";
import { StrategyStep } from "./wizard/StrategyStep";
import { useWizardState } from "@/hooks/useWizardState";
import { WizardStep } from "./wizard/WizardStep";
import { Card } from "@/components/ui/card";
import { STRATEGY_DESCRIPTIONS } from "@/constants/strategyDescriptions";
import { WIZARD_STEPS, type WizardStepValue } from "@/constants/wizardSteps";

export const OnboardingWizard = () => {
  const {
    activeStep,
    setActiveStep,
    portfolioSize,
    allocations,
    selectedStrategy,
    setSelectedStrategy,
    customAllocations,
    updateAllocation,
    handleCustomAllocationChange,
    totalAllocation,
    totalCustomAllocation,
  } = useWizardState();

  const isStepComplete = (step: WizardStepValue) => {
    const steps = WIZARD_STEPS.map(s => s.value);
    const currentIndex = steps.indexOf(activeStep as WizardStepValue);
    const stepIndex = steps.indexOf(step);
    return stepIndex < currentIndex;
  };

  const renderStepContent = (step: WizardStepValue) => {
    switch (step) {
      case "portfolio":
        return <PortfolioStep onContinue={() => setActiveStep("allocation")} />;
      case "allocation":
        return (
          <AllocationStep
            allocations={allocations}
            updateAllocation={updateAllocation}
            totalAllocation={totalAllocation}
            portfolioSize={portfolioSize}
            onContinue={() => setActiveStep("strategy")}
          />
        );
      case "strategy":
        return (
          <StrategyStep
            selectedStrategy={selectedStrategy}
            onStrategyChange={setSelectedStrategy}
            customAllocations={customAllocations}
            totalCustomAllocation={totalCustomAllocation}
            onCustomAllocationChange={handleCustomAllocationChange}
            setActiveStep={setActiveStep}
          />
        );
      case "alternatives":
        return (
          <>
            {selectedStrategy && selectedStrategy !== 'advanced' && (
              <>
                <h3 className="text-xl font-semibold mb-4">
                  {selectedStrategy.toUpperCase()}
                </h3>
                <Card className="p-4 bg-gray-50 mb-4">
                  <p className="text-gray-700">
                    <span className="font-semibold">Strategy Rationale:</span>{" "}
                    {STRATEGY_DESCRIPTIONS[selectedStrategy].rationale}
                  </p>
                </Card>
              </>
            )}
            <div className="text-center text-gray-500">
              Coming soon: Alternative investment allocation options
            </div>
          </>
        );
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-3 py-4 sm:px-4 md:px-6 animate-fade-in">
      <Accordion
        type="single"
        value={activeStep}
        onValueChange={setActiveStep}
        className="w-full space-y-4"
      >
        {WIZARD_STEPS.map((step) => (
          <WizardStep
            key={step.value}
            value={step.value}
            stepNumber={step.stepNumber}
            title={step.title}
            isComplete={isStepComplete(step.value)}
          >
            {renderStepContent(step.value)}
          </WizardStep>
        ))}
      </Accordion>
    </div>
  );
};