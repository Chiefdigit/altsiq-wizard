import { useState, useEffect } from "react";
import type { AllocationValues } from "@/types/allocation";

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
  const [portfolioSize, setPortfolioSize] = useState(500000);
  const [allocations, setAllocations] = useState<AllocationValues>(DEFAULT_ALLOCATIONS);
  const [selectedStrategy, setSelectedStrategy] = useState("diversification");
  const [customAllocations, setCustomAllocations] = useState<AllocationValues>(DEFAULT_CUSTOM_ALLOCATIONS);

  // Update allocations when portfolio size changes
  useEffect(() => {
    console.log("Portfolio size changed in useWizardState:", portfolioSize);
    
    // Recalculate dollar values while maintaining percentages
    const updatedAllocations = { ...allocations };
    Object.entries(updatedAllocations).forEach(([key, percentage]) => {
      const dollarValue = (percentage / 100) * portfolioSize;
      console.log(`Recalculated ${key} allocation:`, {
        percentage,
        portfolioSize,
        dollarValue
      });
    });
    
    // Force a re-render with the new portfolio size
    setAllocations({ ...updatedAllocations });
  }, [portfolioSize]);

  const updateAllocation = (type: keyof AllocationValues, value: number) => {
    const remainingTotal = Object.entries(allocations)
      .filter(([key]) => key !== type)
      .reduce((sum, [_, val]) => sum + val, 0);

    if (remainingTotal + value <= 100) {
      const dollarValue = (value / 100) * portfolioSize;
      console.log(`Updating allocation for ${type}:`, value, "Current portfolio size:", portfolioSize);
      console.log(`Dollar value for ${type}:`, dollarValue);

      const newAllocations = {
        ...allocations,
        [type]: value
      };
      
      setAllocations(newAllocations);
      console.log("Updated allocations:", newAllocations, "Portfolio size:", portfolioSize);
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
    updateAllocation,
    handleCustomAllocationChange,
    totalAllocation,
    totalCustomAllocation,
  };
};