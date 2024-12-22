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
    onStrategyChange(value);
    setIsSelected(false);
    
    // Store the strategy when it changes
    localStorage.setItem('selectedStrategy', value);
    console.log('Stored strategy in localStorage:', value);
    
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

  const handleSelect = () => {
    // Save strategy when selecting
    localStorage.setItem('selectedStrategy', selectedStrategy);
    console.log('Strategy saved on select:', selectedStrategy);
    
    // Save allocations based on strategy type
    if (selectedStrategy === 'advanced') {
      localStorage.setItem('alternativesAllocations', JSON.stringify(customAllocations));
      console.log('Saved advanced allocations:', customAllocations);
    } else {
      const strategyKey = selectedStrategy as keyof typeof STRATEGY_ALLOCATIONS;
      const allocations = STRATEGY_ALLOCATIONS[strategyKey];
      localStorage.setItem('alternativesAllocations', JSON.stringify(allocations));
      console.log('Saved predefined allocations for strategy:', selectedStrategy, allocations);
    }
    
    handleStrategySelect();
    
    toast({
      title: "Strategy Confirmed",
      description: `${selectedStrategy.charAt(0).toUpperCase() + selectedStrategy.slice(1)} strategy has been saved`,
    });
  };

  const handleContinue = () => {
    // Verify strategy and allocations are properly saved before continuing
    const savedStrategy = localStorage.getItem('selectedStrategy');
    console.log('Continuing with saved strategy:', savedStrategy);
    
    if (savedStrategy !== selectedStrategy) {
      // Ensure strategy is saved one final time before continuing
      localStorage.setItem('selectedStrategy', selectedStrategy);
      console.log('Re-saved strategy before continuing:', selectedStrategy);
      
      // Re-save allocations to ensure consistency
      if (selectedStrategy === 'advanced') {
        localStorage.setItem('alternativesAllocations', JSON.stringify(customAllocations));
      } else {
        const strategyKey = selectedStrategy as keyof typeof STRATEGY_ALLOCATIONS;
        const allocations = STRATEGY_ALLOCATIONS[strategyKey];
        localStorage.setItem('alternativesAllocations', JSON.stringify(allocations));
      }
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
        onSelect={handleSelect}
        onContinue={handleContinue}
      />
    </div>
  );
};