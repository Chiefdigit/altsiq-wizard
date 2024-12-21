import { diversificationStrategy } from './strategies/diversification';
import { incomeStrategy } from './strategies/income';
import { growthStrategy } from './strategies/growth';
import { preservationStrategy } from './strategies/preservation';
import type { StrategyDescription, AllocationValues } from './types';

const calculateVolatilityScore = (allocation: AllocationValues) => {
  const weights = {
    equities: allocation.equities / 100,
    bonds: allocation.bonds / 100,
    cash: allocation.cash / 100,
    alternatives: allocation.alternatives / 100
  };

  return Number(((weights.equities * 4) + (weights.bonds * 2) + (weights.cash * 1) + (weights.alternatives * 3)).toFixed(2));
};

const strategies = {
  diversification: {
    ...diversificationStrategy,
    get volatilityScore() {
      return calculateVolatilityScore(this.allocation);
    }
  },
  income: {
    ...incomeStrategy,
    get volatilityScore() {
      return calculateVolatilityScore(this.allocation);
    }
  },
  growth: {
    ...growthStrategy,
    get volatilityScore() {
      return calculateVolatilityScore(this.allocation);
    }
  },
  preservation: {
    ...preservationStrategy,
    get volatilityScore() {
      return calculateVolatilityScore(this.allocation);
    }
  },
  advanced: {
    title: "+ Advanced",
    objective: "Let's build a personalized allocation for you.",
    description: "Create your own custom allocation strategy.",
    points: ["Customize your portfolio allocation based on your specific needs"] as string[],
    allocation: {
      equities: 25,
      bonds: 25,
      cash: 25,
      alternatives: 25
    },
    rationale: "Custom allocation strategy based on your specific investment goals and risk tolerance.",
    get volatilityScore() {
      return calculateVolatilityScore(this.allocation);
    }
  }
} as const;

export const STRATEGY_DESCRIPTIONS: Record<keyof typeof strategies, StrategyDescription> = strategies;