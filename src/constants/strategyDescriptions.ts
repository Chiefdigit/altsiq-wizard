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
  volatilityScore?: number;
};

const calculateVolatilityScore = (allocation: { equities: number; bonds: number; cash: number; alternatives: number; }) => {
  const weights = {
    equities: allocation.equities / 100,
    bonds: allocation.bonds / 100,
    cash: allocation.cash / 100,
    alternatives: allocation.alternatives / 100
  };

  return Number(((weights.equities * 4) + (weights.bonds * 2) + (weights.cash * 1) + (weights.alternatives * 3)).toFixed(2));
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
      equities: 35,
      bonds: 20,
      cash: 5,
      alternatives: 40
    },
    get volatilityScore() {
      return calculateVolatilityScore(this.allocation);
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
      equities: 15,
      bonds: 35,
      cash: 5,
      alternatives: 45
    },
    get volatilityScore() {
      return calculateVolatilityScore(this.allocation);
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
      equities: 50,
      bonds: 10,
      cash: 5,
      alternatives: 35
    },
    get volatilityScore() {
      return calculateVolatilityScore(this.allocation);
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
      equities: 10,
      bonds: 50,
      cash: 10,
      alternatives: 30
    },
    get volatilityScore() {
      return calculateVolatilityScore(this.allocation);
    }
  },
  advanced: {
    title: "+ Advanced",
    objective: "Let's build a personalized allocation for you.",
    description: "",
    points: [],
    allocation: {
      equities: 25,
      bonds: 25,
      cash: 25,
      alternatives: 25
    },
    get volatilityScore() {
      return calculateVolatilityScore(this.allocation);
    }
  }
};