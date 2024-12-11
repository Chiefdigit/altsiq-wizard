export interface StrategyProps {
  title: string;
  objective: string;
  characteristics: string[];
  allocations: {
    equities: number;
    bonds: number;
    cash: number;
    alternatives: number;
  };
  volatility: "VERY LOW" | "LOW - MODERATE" | "MODERATE" | "HIGH";
}

export const strategies: StrategyProps[] = [
  {
    title: "Asset Diversification",
    objective: "Spread risk across uncorrelated assets, balancing exposure to traditional asset classes and alternatives.",
    characteristics: [
      "Focused on reducing overall portfolio risk through exposure to uncorrelated assets.",
      "Expecting moderate volatility, willing to accept some risk but avoids large swings.",
      "Seeking steady, risk-adjusted returns that outpace inflation.",
      "Comfortable with a medium to long-term horizon, with moderate liquidity needs.",
      "Prioritizing risk management and balanced exposure over maximizing returns."
    ],
    allocations: {
      equities: 35,
      bonds: 20,
      cash: 5,
      alternatives: 40
    },
    volatility: "MODERATE"
  },
  {
    title: "Income Generation",
    objective: "Maximize income generation through assets that provide regular cash flow.",
    characteristics: [
      "Focused on maximizing regular income through interest, dividends, or rent.",
      "Expecting low to moderate volatility and seeks stability in returns.",
      "Looking for steady income generation with modest capital growth.",
      "Has a medium-term horizon, with a need for liquidity to fund regular expenses.",
      "Income-focused, preferring stable, cash-flow-generating assets over risky investments."
    ],
    allocations: {
      equities: 15,
      bonds: 35,
      cash: 5,
      alternatives: 45
    },
    volatility: "LOW - MODERATE"
  },
  {
    title: "Long-term Growth",
    objective: "Maximize capital appreciation, willing to take on more risk for higher potential returns.",
    characteristics: [
      "Focused on maximizing capital appreciation by investing in high-growth assets.",
      "Expecting high volatility and comfortable with large fluctuations in portfolio value.",
      "Seeking above-average returns, with an emphasis on long-term wealth creation.",
      "Comfortable with a long-term horizon, often in illiquid assets with delayed payouts.",
      "Primarily growth-oriented, willing to take on significant risk for potential future gains."
    ],
    allocations: {
      equities: 50,
      bonds: 10,
      cash: 5,
      alternatives: 35
    },
    volatility: "HIGH"
  },
  {
    title: "Asset Preservation",
    objective: "Preserve capital with low volatility and minimal risk.",
    characteristics: [
      "Focused on preserving capital and minimizing risk, with low volatility expectations.",
      "Expecting very low volatility and values stability and predictability in returns.",
      "Seeking modest returns, mainly to protect against inflation without eroding principal.",
      "Prefers a short to medium-term horizon, with a high demand for liquidity.",
      "Highly conservative, more concerned with avoiding losses than seeking gains."
    ],
    allocations: {
      equities: 10,
      bonds: 50,
      cash: 10,
      alternatives: 30
    },
    volatility: "VERY LOW"
  },
  {
    title: "Custom Allocation",
    objective: "Let's build a personalized allocation for you.",
    characteristics: [],
    allocations: {
      equities: 25,
      bonds: 25,
      cash: 25,
      alternatives: 25
    },
    volatility: "MODERATE"
  }
];
