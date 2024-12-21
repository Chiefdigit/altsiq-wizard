import { StrategyDescription } from '../types';

export const growthStrategy: StrategyDescription = {
  title: "Long-term Growth",
  objective: "Maximize capital appreciation, willing to take on more risk for higher potential returns.",
  description: "Typically, an investor seeking long-term growth is:",
  points: [
    "Focused on maximizing capital appreciation by investing in high-growth assets.",
    "Expecting high volatility and comfortable with large fluctuations in portfolio value.",
    "Seeking above-average returns, with an emphasis on long-term wealth creation.",
    "Comfortable with a long-term horizon, often in illiquid assets with delayed payouts.",
    "Primarily growth-oriented, willing to take on significant risk for potential future gains."
  ],
  allocation: {
    equities: 50,
    bonds: 10,
    cash: 5,
    alternatives: 35
  },
  rationale: "The long-term growth strategy focuses on private equity for high-growth potential, with cryptocurrencies and collectibles for capital gains. Hedge funds add tactical growth, while real assets and commodities provide inflation protection without sacrificing growth."
};