import { StrategyDescription } from '../types';

export const incomeStrategy: StrategyDescription = {
  title: "Income Generation",
  objective: "Maximize income generation through assets that provide regular cash flow.",
  description: "Typically, an investor looking to generate income is:",
  points: [
    "Focused on maximizing regular income through interest, dividends, or rent.",
    "Expecting low to moderate volatility and seeks stability in returns.",
    "Looking for steady income generation with modest capital growth.",
    "Has a medium-term horizon, with a need for liquidity to fund regular expenses.",
    "Income-focused, preferring stable, cash-flow-generating assets over risky investments."
  ],
  allocation: {
    equities: 15,
    bonds: 35,
    cash: 5,
    alternatives: 45
  },
  rationale: "Private credit and debt dominate this strategy due to their ability to provide regular, predictable income. Real assets and commodities offer tangible backing for income generation, while hedge funds can be used selectively for fixed-income strategies."
};