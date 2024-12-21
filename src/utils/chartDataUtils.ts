import { ALTERNATIVES_COLORS, STRATEGY_ALLOCATIONS } from "@/constants/alternativesConfig";

export const getChartData = (categories: Set<string>, selectedStrategy: string) => {
  if (!selectedStrategy) return [];
  
  const currentAllocations = STRATEGY_ALLOCATIONS[selectedStrategy as keyof typeof STRATEGY_ALLOCATIONS];
  if (!currentAllocations) return [];

  return Object.entries(currentAllocations)
    .filter(([category, value]) => categories.has(category) && value > 0) // Only include non-zero values
    .map(([category, value]) => ({
      category,
      value,
      color: ALTERNATIVES_COLORS[category as keyof typeof ALTERNATIVES_COLORS]
    }))
    .sort((a, b) => b.value - a.value);
};

export const getInitialCategories = (selectedStrategy: string): Set<string> => {
  if (!selectedStrategy) return new Set();
  
  const currentAllocations = STRATEGY_ALLOCATIONS[selectedStrategy as keyof typeof STRATEGY_ALLOCATIONS];
  if (!currentAllocations) return new Set();

  // Only include categories with non-zero values
  return new Set(
    Object.entries(currentAllocations)
      .filter(([_, value]) => value > 0)
      .map(([key]) => key)
  );
};