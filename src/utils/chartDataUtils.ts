export interface AlternativesData {
  category: string;
  value: number;
  color?: string;
}

export const getChartData = (categories: Set<string>, selectedStrategy: string): AlternativesData[] => {
  return [];
};

export const getInitialCategories = (selectedStrategy: string): Set<string> => {
  return new Set();
};