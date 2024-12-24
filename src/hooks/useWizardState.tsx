import { useState, useEffect, useCallback } from "react";
import type { AllocationValues } from "@/types/allocation";
import { formatDollarValue } from "@/utils/formatters";

const INITIAL_PORTFOLIO_SIZE = 500000;

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
  const [portfolioSize, setPortfolioSize] = useState(() => {
    const savedSize = localStorage.getItem('portfolioSize');
    return savedSize ? parseInt(savedSize) : INITIAL_PORTFOLIO_SIZE;
  });
  
  const [allocations, setAllocations] = useState<AllocationValues>(() => {
    const savedAllocations = localStorage.getItem('allocations');
    return savedAllocations ? JSON.parse(savedAllocations) : DEFAULT_ALLOCATIONS;
  });

  const [selectedStrategy, setSelectedStrategy] = useState(() => {
    return localStorage.getItem('selectedStrategy') || "diversification";
  });
  
  const [customAllocations, setCustomAllocations] = useState<AllocationValues>(DEFAULT_CUSTOM_ALLOCATIONS);

  // Update allocations when portfolio size changes
  useEffect(() => {
    console.log("Portfolio size updated:", portfolioSize);
    localStorage.setItem('portfolioSize', portfolioSize.toString());
    
    // Update dollar values for each allocation
    Object.entries(allocations).forEach(([key, percentage]) => {
      const dollarValue = (percentage / 100) * portfolioSize;
      console.log(`${key} allocation updated:`, {
        percentage,
        portfolioSize,
        dollarValue: formatDollarValue(dollarValue)
      });
    });
  }, [portfolioSize]);

  const updateAllocation = useCallback((type: keyof AllocationValues, value: number) => {
    console.log(`Updating allocation for ${type}:`, value, "Portfolio size:", portfolioSize);
    
    setAllocations(prev => {
      const newAllocations = { ...prev, [type]: value };
      const dollarValue = (value / 100) * portfolioSize;
      
      console.log(`${type} allocation updated:`, {
        newPercentage: value,
        portfolioSize,
        newDollarValue: formatDollarValue(dollarValue)
      });
      
      return newAllocations;
    });
  }, [portfolioSize]);

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
    setAllocations,
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