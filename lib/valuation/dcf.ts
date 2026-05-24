// lib/valuation/dcf.ts

export interface DCFInputs {
  // Company Basics
  revenue: number; // Current annual revenue
  operatingMargin: number; // Operating margin (%)
  taxRate: number; // Effective tax rate (%)

  // Growth Assumptions
  revenueGrowth5y: number; // Expected revenue growth next 5 years (%)
  revenueGrowthTerminal: number; // Terminal growth rate (%)

  // Investment Needs
  capexPercent: number; // Capex as % of revenue
  nwcPercent: number; // Net working capital change as % of revenue

  // Discount Rate
  wacc: number; // Weighted Average Cost of Capital (%)

  // Balance Sheet
  cash: number; // Cash & equivalents
  debt: number; // Total debt
  sharesOutstanding: number; // Shares outstanding
}

export interface DCFResult {
  fairValuePerShare: number;
  enterpriseValue: number;
  equityValue: number;
  impliedUpside: number; // % vs current price
  assumptions: string[];
  sensitivity?: {
    wacc: number[];
    growth: number[];
    values: number[][];
  };
}

export function calculateDCF(
  inputs: DCFInputs,
  currentPrice?: number,
): DCFResult {
  const {
    revenue,
    operatingMargin,
    taxRate,
    revenueGrowth5y,
    revenueGrowthTerminal,
    capexPercent,
    nwcPercent,
    wacc,
    cash,
    debt,
    sharesOutstanding,
  } = inputs;

  // Convert percentages to decimals
  const opMargin = operatingMargin / 100;
  const tax = taxRate / 100;
  const growth5y = revenueGrowth5y / 100;
  const growthTerm = revenueGrowthTerminal / 100;
  const capex = capexPercent / 100;
  const nwc = nwcPercent / 100;
  const discount = wacc / 100;

  let projectedRevenue = revenue;
  let pvFCFF = 0;

  // Forecast 5 years of Free Cash Flow to Firm
  for (let year = 1; year <= 5; year++) {
    projectedRevenue *= 1 + growth5y;

    const ebit = projectedRevenue * opMargin;
    const nopat = ebit * (1 - tax);
    const reinvestment = projectedRevenue * (capex + nwc);
    const fcff = nopat - reinvestment;

    pvFCFF += fcff / Math.pow(1 + discount, year);
  }

  // Terminal Value (Gordon Growth)
  const finalFCFF =
    projectedRevenue * opMargin * (1 - tax) - projectedRevenue * (capex + nwc);
  const terminalValue =
    (finalFCFF * (1 + growthTerm)) / (discount - growthTerm);
  const pvTerminal = terminalValue / Math.pow(1 + discount, 5);

  // Enterprise Value & Equity Value
  const enterpriseValue = pvFCFF + pvTerminal;
  const equityValue = enterpriseValue + cash - debt;
  const fairValuePerShare = equityValue / sharesOutstanding;

  // Implied upside vs current price
  const impliedUpside = currentPrice
    ? ((fairValuePerShare - currentPrice) / currentPrice) * 100
    : 0;

  return {
    fairValuePerShare,
    enterpriseValue,
    equityValue,
    impliedUpside,
    assumptions: [
      `Revenue growth: ${revenueGrowth5y}% (5y), ${revenueGrowthTerminal}% (terminal)`,
      `Operating margin: ${operatingMargin}%`,
      `Tax rate: ${taxRate}%`,
      `WACC: ${wacc}%`,
      `Reinvestment: ${(capexPercent + nwcPercent).toFixed(1)}% of revenue`,
    ],
  };
}

// Optional: Sensitivity analysis matrix
export function calculateDCFSensitivity(
  inputs: DCFInputs,
): DCFResult["sensitivity"] {
  const waccRange = [8, 10, 12, 14, 16];
  const growthRange = [1, 2, 3, 4, 5];

  const values = waccRange.map((wacc) =>
    growthRange.map((growth) => {
      const result = calculateDCF({
        ...inputs,
        wacc,
        revenueGrowthTerminal: growth,
      });
      return result.fairValuePerShare;
    }),
  );

  return { wacc: waccRange, growth: growthRange, values };
}
