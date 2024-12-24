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

export const useWizardState = () => {
  const [activeStep, setActiveStep] = useState<string>("portfolio");
  const [portfolioSize, setPortfolioSize] = useState(INITIAL_PORTFOLIO_SIZE);
  const [allocations, setAllocations] = useState<AllocationValues>(DEFAULT_ALLOCATIONS);
  const [selectedStrategy, setSelectedStrategy] = useState("diversification");
  const [customAllocations, setCustomAllocations] = useState<AllocationValues>({
    equities: 25,
    bonds: 25,
    cash: 25,
    alternatives: 25,
  });

  // Clear localStorage and set default values on first load
  useEffect(() => {
    const isFirstLoad = !localStorage.getItem('hasVisited');
    
    if (isFirstLoad) {
      console.log('First visit detected, clearing localStorage and setting defaults');
      localStorage.clear();
      localStorage.setItem('hasVisited', 'true');
      localStorage.setItem('portfolioSize', INITIAL_PORTFOLIO_SIZE.toString());
      localStorage.setItem('allocations', JSON.stringify(DEFAULT_ALLOCATIONS));
      localStorage.setItem('selectedStrategy', 'diversification');
      
      setPortfolioSize(INITIAL_PORTFOLIO_SIZE);
      setAllocations(DEFAULT_ALLOCATIONS);
      setSelectedStrategy('diversification');
    } else {
      // Load saved values if they exist
      const savedSize = localStorage.getItem('portfolioSize');
      const savedAllocations = localStorage.getItem('allocations');
      const savedStrategy = localStorage.getItem('selectedStrategy');

      if (savedSize) setPortfolioSize(parseInt(savedSize));
      if (savedAllocations) setAllocations(JSON.parse(savedAllocations));
      if (savedStrategy) setSelectedStrategy(savedStrategy);
    }
  }, []);

  // Update localStorage when portfolio size changes
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
  }, [portfolioSize, allocations]);

  const updateAllocation = useCallback((type: keyof AllocationValues, value: number) => {
    console.log(`Updating allocation for ${type}:`, value, "Portfolio size:", portfolioSize);
    
    setAllocations(prev => {
      const newAllocations = { ...prev, [type]: value };
      localStorage.setItem('allocations', JSON.stringify(newAllocations));
      
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