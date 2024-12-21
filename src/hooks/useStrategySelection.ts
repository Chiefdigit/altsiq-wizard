import { useState } from 'react';
import type { AllocationValues } from '@/constants/types';
import { STRATEGY_DESCRIPTIONS } from '@/constants/strategyDescriptions';

export const useStrategySelection = (
  selectedStrategy: string,
  customAllocations: AllocationValues
) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleStrategySelect = () => {
    const selectedAllocation = selectedStrategy === "advanced" 
      ? customAllocations 
      : STRATEGY_DESCRIPTIONS[selectedStrategy].allocation;
    
    localStorage.setItem('selectedStrategyAllocation', JSON.stringify(selectedAllocation));
    localStorage.setItem('selectedStrategyName', selectedStrategy);
    setIsSelected(true);
  };

  return {
    isSelected,
    handleStrategySelect,
    setIsSelected
  };
};