import React, { createContext, useContext, useState, useEffect } from "react";
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

const DEFAULT_PORTFOLIO_SIZE = 500000;

interface WizardContextType {
  activeStep: string;
  setActiveStep: (step: string) => void;
  portfolioSize: number;
  setPortfolioSize: (size: number) => void;
  allocations: AllocationValues;
  setAllocations: (allocations: AllocationValues) => void;
  selectedStrategy: string;
  setSelectedStrategy: (strategy: string) => void;
  customAllocations: AllocationValues;
  setCustomAllocations: (allocations: AllocationValues) => void;
  updateAllocation: (type: keyof AllocationValues, value: number) => void;
  handleCustomAllocationChange: (type: keyof AllocationValues, value: string) => void;
  totalAllocation: number;
  totalCustomAllocation: number;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeStep, setActiveStep] = useState<string>("portfolio");
  const [portfolioSize, setPortfolioSize] = useState(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      localStorage.setItem('hasVisited', 'true');
      localStorage.setItem('portfolioSize', DEFAULT_PORTFOLIO_SIZE.toString());
      return DEFAULT_PORTFOLIO_SIZE;
    }
    
    // For subsequent visits, try to get the saved size
    const savedSize = localStorage.getItem('portfolioSize');
    return savedSize ? parseInt(savedSize, 10) : DEFAULT_PORTFOLIO_SIZE;
  });

  const [allocations, setAllocations] = useState<AllocationValues>(DEFAULT_ALLOCATIONS);
  const [selectedStrategy, setSelectedStrategy] = useState("diversification");
  const [customAllocations, setCustomAllocations] = useState<AllocationValues>(DEFAULT_CUSTOM_ALLOCATIONS);

  // Effect to handle portfolio size updates
  useEffect(() => {
    console.log("Portfolio size updated in context:", portfolioSize);
    localStorage.setItem('portfolioSize', portfolioSize.toString());
  }, [portfolioSize]);

  // Effect to handle allocation updates
  useEffect(() => {
    console.log("Saving allocations to localStorage:", allocations);
    localStorage.setItem('allocations', JSON.stringify(allocations));
    
    // Log dollar values for each allocation
    Object.entries(allocations).forEach(([key, percentage]) => {
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
  }, [allocations, portfolioSize]);

  const updateAllocation = (type: keyof AllocationValues, value: number) => {
    setAllocations(prev => ({ ...prev, [type]: value }));
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

  return (
    <WizardContext.Provider
      value={{
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
      }}
    >
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error("useWizard must be used within a WizardProvider");
  }
  return context;
};