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
  alternativesBreakdown: {
    privateEquity: number;
    realEstate: number;
    hedge: number;
    venture: number;
  };
  volatilityScore?: number;
  rationale: string;
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
    alternativesBreakdown: {
      privateEquity: 25,
      realEstate: 25,
      hedge: 25,
      venture: 25
    },
    get volatilityScore() {
      return calculateVolatilityScore(this.allocation);
    },
    rationale: "A diversified portfolio would emphasize real assets and commodities due to their defensive nature and low correlation to public equities. Hedge funds and private equity provide alternative sources of returns, while collectibles and cryptocurrencies offer diversification due to their niche status."
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
    alternativesBreakdown: {
      privateEquity: 15,
      realEstate: 40,
      hedge: 30,
      venture: 15
    },
    get volatilityScore() {
      return calculateVolatilityScore(this.allocation);
    },
    rationale: "Private credit and debt dominate this strategy due to their ability to provide regular, predictable income. Real assets and commodities offer tangible backing for income generation, while hedge funds can be used selectively for fixed-income strategies."
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
    alternativesBreakdown: {
      privateEquity: 35,
      realEstate: 20,
      hedge: 15,
      venture: 30
    },
    get volatilityScore() {
      return calculateVolatilityScore(this.allocation);
    },
    rationale: "The long-term growth strategy focuses on private equity for high-growth potential, with cryptocurrencies and collectibles for capital gains. Hedge funds add tactical growth, while real assets and commodities provide inflation protection without sacrificing growth."
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
    alternativesBreakdown: {
      privateEquity: 15,
      realEstate: 35,
      hedge: 35,
      venture: 15
    },
    get volatilityScore() {
      return calculateVolatilityScore(this.allocation);
    },
    rationale: "Asset preservation focuses heavily on real assets and debt instruments, which provide stability, regular income, and low risk. Hedge funds are employed for conservative strategies that minimize drawdowns. Collectibles and commodities can act as stores of value, particularly in uncertain markets."
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
    alternativesBreakdown: {
      privateEquity: 25,
      realEstate: 25,
      hedge: 25,
      venture: 25
    },
    get volatilityScore() {
      return calculateVolatilityScore(this.allocation);
    },
    rationale: ""
  }
};