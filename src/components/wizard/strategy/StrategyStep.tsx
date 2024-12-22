import React from "react";
import { StrategySelector } from "./strategy/StrategySelector";
import { StrategyDetails } from "./strategy/StrategyDetails";
import { StrategyActions } from "./strategy/StrategyActions";
import { AdvancedAllocation } from "../AdvancedAllocation";
import { useStrategySelection } from "@/hooks/useStrategySelection";
import type { AllocationValues } from "@/constants/types";
import { STRATEGY_ALLOCATIONS } from "@/constants/alternativesConfig";

interface StrategyStepProps {
  selectedStrategy: string;
  onStrategyChange: (value: string) => void;
  customAllocations: AllocationValues;
  totalCustomAllocation: number;
  onCustomAllocationChange: (key: keyof AllocationValues, value: string) => void;
  setActiveStep: (step: string) => void;
}

export const StrategyStep = ({
  selectedStrategy,
  onStrategyChange,
  customAllocations,
  totalCustomAllocation,
  onCustomAllocationChange,
  setActiveStep,
}: StrategyStepProps) => {
  const { isSelected, handleStrategySelect, setIsSelected } = useStrategySelection(
    selectedStrategy,
    customAllocations
  );

  const handleStrategyChange = (value: string) => {
    console.log('Setting strategy to:', value);
    onStrategyChange(value);
    setIsSelected(false);
    localStorage.setItem('selectedStrategy', value);
    
    // Store the strategy allocations when strategy changes
    if (value !== 'advanced') {
      const strategyKey = value as keyof typeof STRATEGY_ALLOCATIONS;
      const allocations = STRATEGY_ALLOCATIONS[strategyKey];
      localStorage.setItem('alternativesAllocations', JSON.stringify(allocations));
      console.log('Stored allocations for strategy:', value, allocations);
    }
  };

  return (
    <div className="space-y-6">
      <StrategySelector 
        selectedStrategy={selectedStrategy}
        onStrategyChange={handleStrategyChange}
      />

      {selectedStrategy === "advanced" ? (
        <AdvancedAllocation
          customAllocations={customAllocations}
          totalCustomAllocation={totalCustomAllocation}
          onCustomAllocationChange={onCustomAllocationChange}
        />
      ) : (
        selectedStrategy && <StrategyDetails selectedStrategy={selectedStrategy} />
      )}

      <StrategyActions 
        isSelected={isSelected}
        onSelect={handleStrategySelect}
        onContinue={() => setActiveStep("alternatives")}
      />
    </div>
  );
};