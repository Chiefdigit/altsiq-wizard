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

  // Effect to update allocations when portfolio size changes
  useEffect(() => {
    console.log("Portfolio size changed to:", portfolioSize);
    
    // Update allocations while maintaining percentages
    const updatedAllocations = { ...allocations };
    
    Object.entries(updatedAllocations).forEach(([key, percentage]) => {
      const dollarValue = (percentage / 100) * portfolioSize;
      console.log(`${key} allocation updated:`, {
        percentage,
        portfolioSize,
        dollarValue: new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD' 
        }).format(dollarValue)
      });
    });

    // Force a re-render with the updated allocations
    setAllocations(updatedAllocations);
  }, [portfolioSize]);

  const updateAllocation = (type: keyof AllocationValues, value: number) => {
    const remainingTotal = Object.entries(allocations)
      .filter(([key]) => key !== type)
      .reduce((sum, [_, val]) => sum + val, 0);

    if (remainingTotal + value <= 100) {
      const dollarValue = (value / 100) * portfolioSize;
      console.log(`Updating allocation for ${type}:`, {
        newPercentage: value,
        currentPortfolioSize: portfolioSize,
        newDollarValue: new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD' 
        }).format(dollarValue)
      });

      const newAllocations = { ...allocations, [type]: value };
      setAllocations(newAllocations);
      
      console.log("Updated allocations:", {
        allocations: newAllocations,
        portfolioSize
      });
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