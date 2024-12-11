type StrategyDescription = {
  title: string;
  objective: string;
  description: string;
  points: string[];
  allocation: {
    equities: number;
    bonds: number;
    cash: number;
    alternatives: number;
  };
};

export const STRATEGY_DESCRIPTIONS: Record<string, StrategyDescription> = {
  diversification: {
    title: "Asset Diversification",
    objective: "Spread risk across uncorrelated assets, balancing exposure to traditional asset classes and alternatives.",
    description: "Typically, an investor seeking diversification is:",
    points: [
      "Focused on reducing overall portfolio risk through exposure to uncorrelated assets.",
      "Expecting moderate volatility, willing to accept some risk but avoids large swings.",
      "Seeking steady, risk-adjusted returns that outpace inflation.",
      "Comfortable with a medium to long-term horizon, with moderate liquidity needs.",
      "Prioritizing risk management and balanced exposure over maximizing returns."
    ],
    allocation: {
      equities: 40,
      bonds: 30,
      cash: 10,
      alternatives: 20
    }
  },
  income: {
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
      equities: 30,
      bonds: 40,
      cash: 15,
      alternatives: 15
    }
  },
  growth: {
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
      equities: 60,
      bonds: 15,
      cash: 5,
      alternatives: 20
    }
  },
  preservation: {
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
      equities: 20,
      bonds: 50,
      cash: 20,
      alternatives: 10
    }
  },
  advanced: {
    title: "+ Advanced",
    objective: "Let's build a personalized allocation for you.",
    description: "",
    points: [],
    allocation: {
      equities: 0,
      bonds: 0,
      cash: 0,
      alternatives: 0
    }
  }
};