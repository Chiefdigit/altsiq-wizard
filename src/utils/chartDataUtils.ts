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

  // Get all active categories with values > 0
  const activeData = Object.entries(currentAllocations)
    .filter(([category, value]) => value > 0 && categories.has(category));

  // Calculate total of active categories
  const total = activeData.reduce((sum, [_, value]) => sum + value, 0);

  // Map to final format with adjusted percentages
  return activeData
    .map(([category, value]) => ({
      category,
      // Recalculate percentage based on total of active categories
      value: total > 0 ? (value / total) * 100 : value,
      color: ALTERNATIVES_COLORS[category as keyof typeof ALTERNATIVES_COLORS]
    }))
    .sort((a, b) => b.value - a.value);
};

export const getInitialCategories = (selectedStrategy: string): Set<string> => {
  if (!selectedStrategy) return new Set();
  
  const currentAllocations = STRATEGY_ALLOCATIONS[selectedStrategy as keyof typeof STRATEGY_ALLOCATIONS];
  if (!currentAllocations) return new Set();

  return new Set(
    Object.entries(currentAllocations)
      .filter(([_, value]) => value > 0)
      .map(([key]) => key)
  );
};