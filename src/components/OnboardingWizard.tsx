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

export const OnboardingWizard = () => {
  const [activeStep, setActiveStep] = useState<string>("portfolio");
  const [portfolioSize, setPortfolioSize] = useState(500000);
  const [allocations, setAllocations] = useState({
    equities: 60,
    bonds: 40,
    cash: 0,
    alternatives: 0,
  });

  useEffect(() => {
    setAllocations({
      equities: 60,
      bonds: 40,
      cash: 0,
      alternatives: 0,
    });
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
    <div className="max-w-2xl mx-auto p-2">
      <Accordion
        type="single"
        value={activeStep}
        onValueChange={setActiveStep}
        className="w-full space-y-2"
      >
        <AccordionItem value="portfolio" className="border rounded-lg p-3">
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

        <AccordionItem value="allocation" className="border rounded-lg p-3">
          <AccordionTrigger className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                <Check size={14} />
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
              <AllocationSlider
                label="Equities"
                value={allocations.equities}
                onChange={(value) => updateAllocation("equities", value)}
                portfolioSize={portfolioSize}
              />
              <AllocationSlider
                label="Bonds"
                value={allocations.bonds}
                onChange={(value) => updateAllocation("bonds", value)}
                portfolioSize={portfolioSize}
              />
              <AllocationSlider
                label="Cash"
                value={allocations.cash}
                onChange={(value) => updateAllocation("cash", value)}
                portfolioSize={portfolioSize}
              />
              <AllocationSlider
                label="Alternatives"
                value={allocations.alternatives}
                onChange={(value) => updateAllocation("alternatives", value)}
                portfolioSize={portfolioSize}
              />
              <AllocationChart allocations={allocations} />
              <RiskScoreDisplay allocations={allocations} />
              <div className="flex justify-end">
                <Button onClick={handleComplete}>Complete</Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};