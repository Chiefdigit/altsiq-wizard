import React, { useState } from "react";
import { PortfolioSlider } from "./PortfolioSlider";
import { AllocationSlider } from "./AllocationSlider";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export const OnboardingWizard = () => {
  const [step, setStep] = useState(1);
  const [portfolioSize, setPortfolioSize] = useState(500000);
  const [allocations, setAllocations] = useState({
    equities: 60,
    bonds: 40,
    cash: 0,
    alternatives: 0,
  });

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      toast({
        title: "Portfolio Created!",
        description: "Your portfolio has been successfully configured.",
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updateAllocation = (type: keyof typeof allocations, value: number) => {
    const total = Object.entries(allocations)
      .filter(([key]) => key !== type)
      .reduce((sum, [_, val]) => sum + val, 0);

    if (total + value <= 100) {
      setAllocations({ ...allocations, [type]: value });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {step === 1 ? "Portfolio Size" : "Asset Allocation"}
        </h1>
        <p className="text-gray-600">
          {step === 1
            ? "Set your total portfolio value"
            : "Adjust your asset allocation"}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        {step === 1 ? (
          <PortfolioSlider value={portfolioSize} onChange={setPortfolioSize} />
        ) : (
          <div>
            <AllocationSlider
              label="Equities"
              value={allocations.equities}
              onChange={(value) => updateAllocation("equities", value)}
            />
            <AllocationSlider
              label="Bonds"
              value={allocations.bonds}
              onChange={(value) => updateAllocation("bonds", value)}
            />
            <AllocationSlider
              label="Cash"
              value={allocations.cash}
              onChange={(value) => updateAllocation("cash", value)}
            />
            <AllocationSlider
              label="Alternatives"
              value={allocations.alternatives}
              onChange={(value) => updateAllocation("alternatives", value)}
            />
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
          className="w-24"
        >
          Back
        </Button>
        <Button onClick={handleNext} className="w-24">
          {step === 2 ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
};