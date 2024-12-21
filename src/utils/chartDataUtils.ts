import { ALTERNATIVES_COLORS, STRATEGY_ALLOCATIONS } from "@/constants/alternativesConfig";

export interface AlternativesData {
  category: string;
  value: number;
  color: string;
}

export const getChartData = (categories: Set<string>, selectedStrategy: string): AlternativesData[] => {
  const currentAllocations = STRATEGY_ALLOCATIONS[selectedStrategy as keyof typeof STRATEGY_ALLOCATIONS];
  return Array.from(categories)
    .filter(category => currentAllocations[category as keyof typeof currentAllocations] > 0)
    .map(category => ({
      category,
      value: currentAllocations[category as keyof typeof currentAllocations],
      color: ALTERNATIVES_COLORS[category as keyof typeof ALTERNATIVES_COLORS]
    }));
};

export const getInitialCategories = (selectedStrategy: string): Set<string> => {
  const currentAllocations = STRATEGY_ALLOCATIONS[selectedStrategy as keyof typeof STRATEGY_ALLOCATIONS];
  return new Set(
    Object.entries(currentAllocations)
      .filter(([_, value]) => value > 0)
      .map(([key]) => key)
  );
};