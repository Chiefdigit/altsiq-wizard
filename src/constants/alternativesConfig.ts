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
    "Private Equity": 10,
    "Hedge Funds": 15,
    "Real Estate": 20,
    "Private Credit": 10,
    "Private Debt": 10,
    "Collectibles": 5,
    "Cryptocurrencies": 5,
    "Commodities": 25
  },
  income: {
    "Private Equity": 5,
    "Hedge Funds": 5,
    "Real Estate": 20,
    "Private Credit": 25,
    "Private Debt": 25,
    "Collectibles": 0,
    "Cryptocurrencies": 0,
    "Commodities": 20
  },
  growth: {
    "Private Equity": 35,
    "Hedge Funds": 10,
    "Real Estate": 10,
    "Private Credit": 5,
    "Private Debt": 5,
    "Collectibles": 10,
    "Cryptocurrencies": 15,
    "Commodities": 10
  },
  preservation: {
    "Private Equity": 0,
    "Hedge Funds": 10,
    "Real Estate": 30,
    "Private Credit": 20,
    "Private Debt": 20,
    "Collectibles": 5,
    "Cryptocurrencies": 0,
    "Commodities": 15
  },
  advanced: {
    "Private Equity": 15,
    "Hedge Funds": 15,
    "Real Estate": 15,
    "Private Credit": 15,
    "Private Debt": 10,
    "Collectibles": 15,
    "Cryptocurrencies": 5,
    "Commodities": 10
  }
} as const;