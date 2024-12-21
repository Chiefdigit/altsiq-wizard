import { useState, useEffect } from "react";
import type { AllocationValues } from "@/types/allocation";
import { formatDollarValue } from "@/utils/formatters";

const DEFAULT_ALLOCATIONS = {
  equities: 60,
  bonds: 40,
  cash: 0,
  alternatives: 0,
};

const DEFAULT_CUSTOM_ALLOCATIONS = {
  equities: 25,
  bonds: 25,
  cash: 25,
  alternatives: 25,
};

export const useWizardState = () => {
  const [activeStep, setActiveStep] = useState<string>("portfolio");
  const [portfolioSize, setPortfolioSize] = useState(50000);
  const [allocations, setAllocations] = useState<AllocationValues>(DEFAULT_ALLOCATIONS);
  const [selectedStrategy, setSelectedStrategy] = useState("diversification");
  const [customAllocations, setCustomAllocations] = useState<AllocationValues>(DEFAULT_CUSTOM_ALLOCATIONS);

  // Effect to update allocations when portfolio size changes
  useEffect(() => {
    console.log("Portfolio size updated:", portfolioSize);
    
    // Recalculate dollar values for each allocation based on new portfolio size
    Object.entries(allocations).forEach(([key, percentage]) => {
      const dollarValue = (percentage / 100) * portfolioSize;
      console.log(`${key} allocation updated:`, {
        percentage,
        portfolioSize,
        dollarValue: formatDollarValue(dollarValue)
      });
    });
  }, [portfolioSize, allocations]);

  const updateAllocation = (type: keyof AllocationValues, value: number) => {
    const remainingTotal = Object.entries(allocations)
      .filter(([key]) => key !== type)
      .reduce((sum, [_, val]) => sum + val, 0);

    if (remainingTotal + value <= 100) {
      const dollarValue = (value / 100) * portfolioSize;
      console.log(`${type} allocation updated:`, {
        newPercentage: value,
        portfolioSize,
        newDollarValue: formatDollarValue(dollarValue)
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
    setActiveStep,
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