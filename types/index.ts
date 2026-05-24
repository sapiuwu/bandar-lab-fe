export interface StockBasic {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  currency: string;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

export interface StockMetrics {
  // Valuation
  per: number | null; // Price/Earnings
  pbv: number | null; // Price/Book Value
  pcf: number | null; // Price/Cash Flow
  peg: number | null; // PEG Ratio

  // Profitability
  roe: number | null; // Return on Equity (%)
  roi: number | null; // Return on Investment (%)
  npm: number | null; // Net Profit Margin (%)
  gpm: number | null; // Gross Profit Margin (%)

  // Financial Health
  der: number | null; // Debt/Equity Ratio
  cr: number | null; // Current Ratio
  quickRatio: number | null;

  // Market Data
  marketCap: number; // in IDR/USD
  freeFloat: number; // %
  volume: number;
  avgVolume: number;

  // Cash Flow
  operatingCashFlow: number;
  freeCashFlow: number;
  fcfYield: number | null;
}

export interface ValuationInput {
  // DCF
  revenueGrowth: number;
  operatingMargin: number;
  taxRate: number;
  capexPercent: number;
  nwcPercent: number;
  wacc: number;
  terminalGrowth: number;
  forecastYears: number;

  // DDM
  dividendPerShare: number;
  dividendGrowth: number;
  requiredReturn: number;

  // Buffett
  consistentEarnings: boolean;
  durableMoat: boolean;
  competentManagement: boolean;
  marginOfSafety: number; // %
}

export interface ValuationResult {
  method: "DCF" | "DDM" | "Buffett" | "Consensus";
  fairValue: number;
  upside: number; // % vs current price
  assumption: string;
}

export interface StockScore {
  overall: number; // 0-100
  valuation: number;
  profitability: number;
  financialHealth: number;
  growth: number;
  recommendation: "Strong Buy" | "Buy" | "Hold" | "Sell" | "Strong Sell";
  breakdown: {
    metric: string;
    score: number;
    weight: number;
    note: string;
  }[];
}
