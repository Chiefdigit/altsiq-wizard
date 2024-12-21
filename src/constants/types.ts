export interface AllocationValues {
  equities: number;
  bonds: number;
  cash: number;
  alternatives: number;
}

export interface StrategyDescription {
  title: string;
  objective: string;
  description: string;
  points: string[];
  allocation: AllocationValues;
  rationale: string;
  volatilityScore?: number;
}