import { ALTERNATIVES_COLORS, STRATEGY_ALLOCATIONS } from "@/constants/alternativesConfig";

export interface AlternativesData {
  category: string;
  value: number;
  color: string;
}

export const getChartData = (categories: Set<string>, selectedStrategy: string): AlternativesData[] => {
  if (!selectedStrategy) return [];
  
  const currentAllocations = STRATEGY_ALLOCATIONS[selectedStrategy as keyof typeof STRATEGY_ALLOCATIONS];
  if (!currentAllocations) return [];

  // Filter out zero values and categories not in the set
  return Object.entries(currentAllocations)
    .filter(([category, value]) => categories.has(category) && value > 0)
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

  // Only include categories with values greater than 0
  return new Set(
    Object.entries(currentAllocations)
      .filter(([_, value]) => value > 0)
      .map(([key]) => key)
  );
};