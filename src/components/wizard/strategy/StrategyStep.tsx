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
    
    // Update strategy in context and localStorage
    onStrategyChange(value);
    setIsSelected(false);
    localStorage.setItem('selectedStrategy', value);
    
    // Store the strategy allocations
    if (value !== 'advanced') {
      const strategyKey = value as keyof typeof STRATEGY_ALLOCATIONS;
      const allocations = STRATEGY_ALLOCATIONS[strategyKey];
      console.log('Setting allocations for strategy:', value, allocations);
      localStorage.setItem('alternativesAllocations', JSON.stringify(allocations));
    }
    
    toast({
      title: "Strategy Updated",
      description: `Selected ${value.charAt(0).toUpperCase() + value.slice(1)} strategy`,
    });
  };

  const handleContinue = () => {
    // Get the current strategy and ensure its allocations are saved
    const currentStrategy = selectedStrategy;
    console.log('Continuing with strategy:', currentStrategy);
    
    if (currentStrategy === 'advanced') {
      // For advanced strategy, save the custom allocations
      localStorage.setItem('alternativesAllocations', JSON.stringify(customAllocations));
    } else {
      // For predefined strategies, save the corresponding allocations
      const strategyKey = currentStrategy as keyof typeof STRATEGY_ALLOCATIONS;
      const allocations = STRATEGY_ALLOCATIONS[strategyKey];
      localStorage.setItem('alternativesAllocations', JSON.stringify(allocations));
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