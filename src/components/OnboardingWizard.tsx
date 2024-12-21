import React from "react";
import { Accordion } from "@/components/ui/accordion";
import { PortfolioStep } from "./wizard/PortfolioStep";
import { AllocationStep } from "./wizard/AllocationStep";
import { StrategyStep } from "./wizard/StrategyStep";
import { useWizardState } from "@/hooks/useWizardState";
import { WizardStep } from "./wizard/WizardStep";
import { Card } from "@/components/ui/card";
import { STRATEGY_DESCRIPTIONS } from "@/constants/strategyDescriptions";

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

  const isStepComplete = (step: string) => {
    const steps = ["portfolio", "allocation", "strategy", "alternatives"];
    const currentIndex = steps.indexOf(activeStep);
    const stepIndex = steps.indexOf(step);
    return stepIndex < currentIndex;
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-3 py-4 sm:px-4 md:px-6 animate-fade-in">
      <Accordion
        type="single"
        value={activeStep}
        onValueChange={setActiveStep}
        className="w-full space-y-4"
      >
        <WizardStep
          value="portfolio"
          stepNumber="1"
          title="Portfolio Size"
          isComplete={isStepComplete("portfolio")}
        >
          <PortfolioStep onContinue={() => setActiveStep("allocation")} />
        </WizardStep>

        <WizardStep
          value="allocation"
          stepNumber="2"
          title="Asset Allocation"
          isComplete={isStepComplete("allocation")}
        >
          <AllocationStep
            allocations={allocations}
            updateAllocation={updateAllocation}
            totalAllocation={totalAllocation}
            portfolioSize={portfolioSize}
            onContinue={() => setActiveStep("strategy")}
          />
        </WizardStep>

        <WizardStep
          value="strategy"
          stepNumber="3"
          title="Investment Strategy"
          isComplete={isStepComplete("strategy")}
        >
          <StrategyStep
            selectedStrategy={selectedStrategy}
            onStrategyChange={setSelectedStrategy}
            customAllocations={customAllocations}
            totalCustomAllocation={totalCustomAllocation}
            onCustomAllocationChange={handleCustomAllocationChange}
            setActiveStep={setActiveStep}
          />
        </WizardStep>

        <WizardStep
          value="alternatives"
          stepNumber="4"
          title="Alternatives Allocation"
          isComplete={isStepComplete("alternatives")}
        >
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
        </WizardStep>
      </Accordion>
    </div>
  );
};