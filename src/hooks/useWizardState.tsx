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
    
    // Calculate dollar values based on current percentages and new portfolio size
    const currentDollarValues = Object.entries(allocations).reduce((acc, [key, percentage]) => {
      acc[key as keyof AllocationValues] = (percentage / 100) * portfolioSize;
      return acc;
    }, {} as Record<keyof AllocationValues, number>);

    console.log("Updated dollar values:", currentDollarValues);
    
    // Keep the same percentages but ensure they reflect the new portfolio size
    const updatedAllocations = { ...allocations };
    setAllocations(updatedAllocations);
  }, [portfolioSize]);

  const updateAllocation = (type: keyof AllocationValues, value: number) => {
    console.log(`Updating allocation for ${type}:`, value, "Current portfolio size:", portfolioSize);
    
    // Calculate the remaining allocation excluding the current type
    const remainingTotal = Object.entries(allocations)
      .filter(([key]) => key !== type)
      .reduce((sum, [_, val]) => sum + val, 0);

    // Only update if the new total would not exceed 100%
    if (remainingTotal + value <= 100) {
      const newAllocations = {
        ...allocations,
        [type]: value
      };
      
      // Calculate and log the actual dollar value for this allocation
      const dollarValue = (value / 100) * portfolioSize;
      console.log(`Dollar value for ${type}:`, dollarValue);
      
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
