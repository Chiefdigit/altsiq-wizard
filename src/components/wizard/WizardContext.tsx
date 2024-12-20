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
  const [portfolioSize, setPortfolioSize] = useState(500000);
  const [allocations, setAllocations] = useState<AllocationValues>(DEFAULT_ALLOCATIONS);
  const [selectedStrategy, setSelectedStrategy] = useState("diversification");
  const [customAllocations, setCustomAllocations] = useState<AllocationValues>(DEFAULT_CUSTOM_ALLOCATIONS);

  // Effect to update allocations when portfolio size changes
  useEffect(() => {
    console.log("Portfolio size updated in context:", portfolioSize);
  }, [portfolioSize]);

  const updateAllocation = (type: keyof AllocationValues, value: number) => {
    console.log(`Updating allocation for ${type}:`, value, "Portfolio size:", portfolioSize);
    const total = Object.entries(allocations)
      .filter(([key]) => key !== type)
      .reduce((sum, [_, val]) => sum + val, 0);

    if (total + value <= 100) {
      const newAllocations = { ...allocations, [type]: value };
      setAllocations(newAllocations);
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