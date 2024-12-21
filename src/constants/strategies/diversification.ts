import { StrategyDescription } from '../types';

export const diversificationStrategy: StrategyDescription = {
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
  rationale: "A diversified portfolio would emphasize real assets and commodities due to their defensive nature and low correlation to public equities. Hedge funds and private equity provide alternative sources of returns, while collectibles and cryptocurrencies offer diversification due to their niche status."
};