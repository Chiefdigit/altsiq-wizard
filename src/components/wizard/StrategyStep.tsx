import React, { useState } from "react";
import { StrategySelector } from "./strategy/StrategySelector";
import { StrategyDetails } from "./strategy/StrategyDetails";
import { StrategyActions } from "./strategy/StrategyActions";
import { AdvancedAllocation } from "../AdvancedAllocation";
import type { AllocationValues } from "@/types/allocation";

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
  const [isSelected, setIsSelected] = useState(false);

  const handleStrategySelect = () => {
    const selectedAllocation = selectedStrategy === "advanced" 
      ? customAllocations 
      : STRATEGY_DESCRIPTIONS[selectedStrategy].allocation;
    
    localStorage.setItem('selectedStrategyAllocation', JSON.stringify(selectedAllocation));
    localStorage.setItem('selectedStrategyName', selectedStrategy);
    setIsSelected(true);
  };

  return (
    <div className="space-y-6">
      <StrategySelector 
        selectedStrategy={selectedStrategy}
        onStrategyChange={(value) => {
          onStrategyChange(value);
          setIsSelected(false);
        }}
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