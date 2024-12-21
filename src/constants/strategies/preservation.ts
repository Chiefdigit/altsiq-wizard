import { StrategyDescription } from '../types';

export const preservationStrategy: StrategyDescription = {
  title: "Asset Preservation",
  objective: "Preserve capital with low volatility and minimal risk.",
  description: "Typically, an investor aiming to preserve assets is:",
  points: [
    "Focused on preserving capital and minimizing risk, with low volatility expectations.",
    "Expecting very low volatility and values stability and predictability in returns.",
    "Seeking modest returns, mainly to protect against inflation without eroding principal.",
    "Prefers a short to medium-term horizon, with a high demand for liquidity.",
    "Highly conservative, more concerned with avoiding losses than seeking gains."
  ],
  allocation: {
    equities: 10,
    bonds: 50,
    cash: 10,
    alternatives: 30
  },
  rationale: "Asset preservation focuses heavily on real assets and debt instruments, which provide stability, regular income, and low risk. Hedge funds are employed for conservative strategies that minimize drawdowns. Collectibles and commodities can act as stores of value, particularly in uncertain markets."
};