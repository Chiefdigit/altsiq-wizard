import React, { useState, useEffect } from "react";
import { PortfolioSlider } from "./PortfolioSlider";
import { AllocationSlider } from "./AllocationSlider";
import { AllocationChart } from "./AllocationChart";
import { RiskScoreDisplay } from "./RiskScoreDisplay";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check } from "lucide-react";

const DEFAULT_ALLOCATIONS = {
  equities: 60,
  bonds: 40,
  cash: 0,
  alternatives: 0,
};

export const OnboardingWizard = () => {
  const [activeStep, setActiveStep] = useState<string>("portfolio");
  const [portfolioSize, setPortfolioSize] = useState(500000);
  const [allocations, setAllocations] = useState(DEFAULT_ALLOCATIONS);

  useEffect(() => {
    setAllocations(DEFAULT_ALLOCATIONS);
  }, [portfolioSize]);

  const handleComplete = () => {
    toast({
      title: "Portfolio Created!",
      description: "Your portfolio has been successfully configured.",
    });
  };

  const updateAllocation = (type: keyof typeof allocations, value: number) => {
    const total = Object.entries(allocations)
      .filter(([key]) => key !== type)
      .reduce((sum, [_, val]) => sum + val, 0);

    if (total + value <= 100) {
      setAllocations({ ...allocations, [type]: value });
    }
  };

  const totalAllocation = Object.values(allocations).reduce(
    (sum, val) => sum + val,
    0
  );

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
            <PortfolioSlider value={portfolioSize} onChange={setPortfolioSize} />
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setActiveStep("allocation")}>Continue</Button>
            </div>
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
            <div className="space-y-6">
              <div className="mb-4 p-3 bg-gray-50 rounded-lg text-center">
                <span className="text-sm text-gray-600">Total Allocation: </span>
                <span className="font-semibold">{totalAllocation}%</span>
              </div>
              {Object.entries(allocations).map(([key, value]) => (
                <AllocationSlider
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={value}
                  onChange={(value) => updateAllocation(key as keyof typeof allocations, value)}
                  portfolioSize={portfolioSize}
                />
              ))}
              <AllocationChart allocations={allocations} />
              <RiskScoreDisplay allocations={allocations} />
              <div className="flex justify-end">
                <Button onClick={handleComplete}>Continue</Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};