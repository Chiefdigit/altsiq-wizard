import React from "react";
import { toast } from "@/components/ui/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check } from "lucide-react";
import { PortfolioStep } from "./wizard/PortfolioStep";
import { AllocationStep } from "./wizard/AllocationStep";
import { StrategyStep } from "./wizard/StrategyStep";
import { useWizardState } from "@/hooks/useWizardState";

export const OnboardingWizard = () => {
  const {
    activeStep,
    setActiveStep,
    portfolioSize,
    setPortfolioSize,
    allocations,
    selectedStrategy,
    setSelectedStrategy,
    customAllocations,
    updateAllocation,
    handleCustomAllocationChange,
    totalAllocation,
    totalCustomAllocation,
  } = useWizardState();

  const handleComplete = () => {
    toast({
      title: "Portfolio Created!",
      description: "Your portfolio has been successfully configured.",
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 animate-fade-in">
      <Accordion
        type="single"
        value={activeStep}
        onValueChange={setActiveStep}
        className="w-full space-y-4"
      >
        <AccordionItem value="portfolio" className="border rounded-lg p-4">
          <AccordionTrigger className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                {activeStep !== "portfolio" ? <Check size={14} /> : "1"}
              </div>
              <span>Portfolio Size</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-6">
            <PortfolioStep
              portfolioSize={portfolioSize}
              onPortfolioSizeChange={setPortfolioSize}
              onContinue={() => setActiveStep("allocation")}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="allocation" className="border rounded-lg p-4">
          <AccordionTrigger className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                {activeStep === "complete" ? <Check size={14} /> : "2"}
              </div>
              <span>Asset Allocation</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-6">
            <AllocationStep
              allocations={allocations}
              updateAllocation={updateAllocation}
              totalAllocation={totalAllocation}
              portfolioSize={portfolioSize}
              onContinue={() => setActiveStep("strategy")}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="strategy" className="border rounded-lg p-4">
          <AccordionTrigger className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                {activeStep === "complete" ? <Check size={14} /> : "3"}
              </div>
              <span>Alts Investment Strategy</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-6">
            <StrategyStep
              selectedStrategy={selectedStrategy}
              onStrategyChange={setSelectedStrategy}
              customAllocations={customAllocations}
              totalCustomAllocation={totalCustomAllocation}
              onCustomAllocationChange={handleCustomAllocationChange}
              onComplete={handleComplete}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};