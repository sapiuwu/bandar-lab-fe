// lib/valuation/ddm.ts

export interface DDMInputs {
  dividendPerShare: number; // Current annual dividend per share
  dividendGrowth5y: number; // Expected dividend growth next 5 years (%)
  dividendGrowthTerminal: number; // Terminal dividend growth (%)
  requiredReturn: number; // Required rate of return / cost of equity (%)
  payoutRatio?: number; // Optional: for two-stage validation
}

export interface DDMResult {
  fairValuePerShare: number;
  impliedUpside: number;
  assumptions: string[];
  stage1PV: number; // PV of first 5 years dividends
  stage2PV: number; // PV of terminal value
}

export function calculateDDM(
  inputs: DDMInputs,
  currentPrice?: number,
): DDMResult {
  const {
    dividendPerShare,
    dividendGrowth5y,
    dividendGrowthTerminal,
    requiredReturn,
  } = inputs;

  const growth5y = dividendGrowth5y / 100;
  const growthTerm = dividendGrowthTerminal / 100;
  const required = requiredReturn / 100;

  // Validate: required return must exceed terminal growth
  if (required <= growthTerm) {
    throw new Error("Required return must exceed terminal growth rate");
  }

  let dividend = dividendPerShare;
  let stage1PV = 0;

  // Stage 1: Explicit forecast (5 years)
  for (let year = 1; year <= 5; year++) {
    dividend *= 1 + growth5y;
    stage1PV += dividend / Math.pow(1 + required, year);
  }

  // Stage 2: Terminal value (Gordon Growth)
  const terminalDividend = dividend * (1 + growthTerm);
  const terminalValue = terminalDividend / (required - growthTerm);
  const stage2PV = terminalValue / Math.pow(1 + required, 5);

  const fairValuePerShare = stage1PV + stage2PV;
  const impliedUpside = currentPrice
    ? ((fairValuePerShare - currentPrice) / currentPrice) * 100
    : 0;

  return {
    fairValuePerShare,
    impliedUpside,
    stage1PV,
    stage2PV,
    assumptions: [
      `Current dividend: Rp ${dividendPerShare.toLocaleString("id-ID")}`,
      `Dividend growth: ${dividendGrowth5y}% (5y), ${dividendGrowthTerminal}% (terminal)`,
      `Required return: ${requiredReturn}%`,
    ],
  };
}
