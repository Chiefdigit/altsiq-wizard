import { diversificationStrategy } from './strategies/diversification';
import { incomeStrategy } from './strategies/income';
import { growthStrategy } from './strategies/growth';
import { preservationStrategy } from './strategies/preservation';
import type { StrategyDescription, AllocationValues } from './types';

const calculateVolatilityScore = (allocation: AllocationValues): number => {
  const weights = {
    equities: allocation.equities / 100,
    bonds: allocation.bonds / 100,
    cash: allocation.cash / 100,
    alternatives: allocation.alternatives / 100
  };

  return Number(((weights.equities * 4) + (weights.bonds * 2) + (weights.cash * 1) + (weights.alternatives * 3)).toFixed(2));
};

const advancedStrategy: StrategyDescription = {
  title: "+ Advanced",
  objective: "Let's build a personalized allocation for you.",
  description: "Create your own custom allocation strategy.",
  points: ["Customize your portfolio allocation based on your specific needs"],
  allocation: {
    equities: 25,
    bonds: 25,
    cash: 25,
    alternatives: 25
  },
  rationale: "Custom allocation strategy based on your specific investment goals and risk tolerance.",
  volatilityScore: 2.5 // Pre-calculated based on default allocation
};

export const STRATEGY_DESCRIPTIONS: Record<string, StrategyDescription> = {
  diversification: {
    ...diversificationStrategy,
    volatilityScore: calculateVolatilityScore(diversificationStrategy.allocation)
  },
  income: {
    ...incomeStrategy,
    volatilityScore: calculateVolatilityScore(incomeStrategy.allocation)
  },
  growth: {
    ...growthStrategy,
    volatilityScore: calculateVolatilityScore(growthStrategy.allocation)
  },
  preservation: {
    ...preservationStrategy,
    volatilityScore: calculateVolatilityScore(preservationStrategy.allocation)
  },
  advanced: advancedStrategy
};