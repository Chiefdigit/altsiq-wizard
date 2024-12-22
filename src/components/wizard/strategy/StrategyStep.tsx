import React from "react";
import { StrategySelector } from "./StrategySelector";
import { StrategyDetails } from "./StrategyDetails";
import { StrategyActions } from "./StrategyActions";
import { AdvancedAllocation } from "../../AdvancedAllocation";
import { useStrategySelection } from "@/hooks/useStrategySelection";
import type { AllocationValues } from "@/constants/types";
import { STRATEGY_ALLOCATIONS } from "@/constants/alternativesConfig";
import { toast } from "@/components/ui/use-toast";

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
    
    // Update strategy in context
    onStrategyChange(value);
    setIsSelected(false);
    
    // Save the selected strategy to localStorage
    localStorage.setItem('selectedStrategy', value);
    
    // Store the strategy allocations
    if (value !== 'advanced') {
      const strategyKey = value as keyof typeof STRATEGY_ALLOCATIONS;
      const allocations = STRATEGY_ALLOCATIONS[strategyKey];
      localStorage.setItem('alternativesAllocations', JSON.stringify(allocations));
      console.log('Stored allocations for strategy:', value, allocations);
    }
    
    toast({
      title: "Strategy Updated",
      description: `Selected ${value.charAt(0).toUpperCase() + value.slice(1)} strategy`,
    });
  };

  const handleContinue = () => {
    // Ensure strategy is properly saved before continuing
    const currentStrategy = selectedStrategy || localStorage.getItem('selectedStrategy') || 'diversification';
    
    if (currentStrategy !== 'advanced') {
      const strategyKey = currentStrategy as keyof typeof STRATEGY_ALLOCATIONS;
      const allocations = STRATEGY_ALLOCATIONS[strategyKey];
      localStorage.setItem('alternativesAllocations', JSON.stringify(allocations));
      console.log('Ensuring allocations are saved for strategy:', currentStrategy, allocations);
    }
    
    setActiveStep("alternatives");
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
        onContinue={handleContinue}
      />
    </div>
  );
};