import { useState, useEffect } from "react";
import type { AllocationValues } from "@/types/allocation";

const DEFAULT_ALLOCATIONS = {
  equities: 0,
  bonds: 0,
  cash: 0,
  alternatives: 0,
};

const STANDARD_ALLOCATION = {
  equities: 60,
  bonds: 40,
  cash: 0,
  alternatives: 0,
};

export const useWizardState = () => {
  const [activeStep, setActiveStep] = useState<string>("portfolio");
  const [portfolioSize, setPortfolioSize] = useState(500000);
  const [allocations, setAllocations] = useState<AllocationValues>(DEFAULT_ALLOCATIONS);
  const [selectedStrategy, setSelectedStrategy] = useState("diversification");
  const [customAllocations, setCustomAllocations] = useState<AllocationValues>({
    equities: 25,
    bonds: 25,
    cash: 25,
    alternatives: 25,
  });

  // Reset allocations when component mounts
  useEffect(() => {
    setAllocations(DEFAULT_ALLOCATIONS);
  }, []);

  // Set standard allocation when moving from portfolio to allocation step
  const handleStepChange = (newStep: string) => {
    if (activeStep === "portfolio" && newStep === "allocation") {
      console.log("Setting standard allocation after portfolio step", {
        portfolioSize,
        newAllocations: STANDARD_ALLOCATION
      });
      setAllocations(STANDARD_ALLOCATION);
    }
    setActiveStep(newStep);
  };

  const updateAllocation = (type: keyof AllocationValues, value: number) => {
    const remainingTotal = Object.entries(allocations)
      .filter(([key]) => key !== type)
      .reduce((sum, [_, val]) => sum + val, 0);

    if (remainingTotal + value <= 100) {
      const dollarValue = (value / 100) * portfolioSize;
      console.log(`${type} allocation updated:`, {
        newPercentage: value,
        portfolioSize,
        newDollarValue: new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD' 
        }).format(dollarValue)
      });

      setAllocations(prev => ({ ...prev, [type]: value }));
    }
  };

  const handleCustomAllocationChange = (type: keyof AllocationValues, value: string) => {
    const numericValue = Math.min(100, Math.max(0, Number(value) || 0));
    setCustomAllocations(prev => ({ ...prev, [type]: numericValue }));
  };

  const totalAllocation = Object.values(allocations).reduce(
    (sum, val) => sum + val,
    0
  );

  const totalCustomAllocation = Object.values(customAllocations).reduce(
    (sum, val) => sum + val,
    0
  );

  return {
    activeStep,
    setActiveStep: handleStepChange,
    portfolioSize,
    setPortfolioSize,
    allocations,
    selectedStrategy,
    setSelectedStrategy,
    customAllocations,
    setCustomAllocations,
    updateAllocation,
    handleCustomAllocationChange,
    totalAllocation,
    totalCustomAllocation,
  };
};