export const ALTERNATIVES_COLORS = {
  "Hedge Funds": "#845EC2",
  "Private Equity": "#D65DB1",
  "Private Credit": "#FF6F91",
  "Private Debt": "#FF9671",
  "Real Estate": "#FFC75F",
  "Cryptocurrencies": "#F9F871",
  "Collectibles": "#008F7A",
  "Commodities": "#4B4453"
} as const;

export const STRATEGY_ALLOCATIONS = {
  diversification: {
    "Private Equity": 15,
    "Hedge Funds": 15,
    "Real Estate": 15,
    "Private Credit": 15,
    "Private Debt": 15,
    "Collectibles": 5,
    "Cryptocurrencies": 5,
    "Commodities": 15
  },
  income: {
    "Private Equity": 0,
    "Hedge Funds": 15,
    "Real Estate": 25,
    "Private Credit": 25,
    "Private Debt": 25,
    "Collectibles": 0,
    "Cryptocurrencies": 0,
    "Commodities": 10
  },
  growth: {
    "Private Equity": 30,
    "Hedge Funds": 15,
    "Real Estate": 10,
    "Private Credit": 5,
    "Private Debt": 5,
    "Collectibles": 10,
    "Cryptocurrencies": 20,
    "Commodities": 5
  },
  preservation: {
    "Private Equity": 0,
    "Hedge Funds": 10,
    "Real Estate": 35,
    "Private Credit": 20,
    "Private Debt": 20,
    "Collectibles": 5,
    "Cryptocurrencies": 0,
    "Commodities": 10
  }
} as const;