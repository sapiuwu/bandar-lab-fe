// lib/valuation/buffett.ts

export interface BuffettInputs {
  // Owner Earnings Approximation
  netIncome: number; // Latest annual net income
  depreciation: number; // Annual depreciation & amortization
  capex: number; // Annual capital expenditures
  workingCapitalChange: number; // Change in working capital

  // Growth & Quality
  earningsGrowth10y: number; // Historical 10y earnings growth (%)
  moatScore: number; // 1-10: competitive advantage strength
  managementScore: number; // 1-10: management quality

  // Buffett Parameters
  marginOfSafety: number; // Desired margin of safety (%)
  requiredReturn: number; // Buffett's typical hurdle rate (%)
}

export interface BuffettResult {
  ownerEarnings: number;
  intrinsicValue: number;
  fairValueWithMoS: number;
  impliedUpside: number;
  qualitativeScore: number; // 0-100 composite score
  assumptions: string[];
  buffettVerdict: "Strong Buy" | "Buy" | "Hold" | "Avoid";
}

export function calculateBuffett(
  inputs: BuffettInputs,
  currentPrice?: number,
): BuffettResult {
  const {
    netIncome,
    depreciation,
    capex,
    workingCapitalChange,
    earningsGrowth10y,
    moatScore,
    managementScore,
    marginOfSafety,
    requiredReturn,
  } = inputs;

  // Step 1: Calculate Owner Earnings (Buffett's preferred metric)
  // Owner Earnings = Net Income + Depreciation - Capex - WC Changes
  const ownerEarnings = netIncome + depreciation - capex - workingCapitalChange;

  // Step 2: Estimate conservative growth rate
  // Use lower of historical growth or 8% (Buffett's long-term avg expectation)
  const conservativeGrowth = Math.min(earningsGrowth10y / 100, 0.08);

  // Step 3: Calculate intrinsic value (simplified perpetuity)
  const hurdleRate = requiredReturn / 100;

  // Guard against invalid inputs
  if (hurdleRate <= conservativeGrowth) {
    throw new Error("Required return must exceed growth rate");
  }

  // Intrinsic value = Owner Earnings / (hurdle - growth)
  let intrinsicValue = ownerEarnings / (hurdleRate - conservativeGrowth);

  // Step 4: Apply qualitative adjustments
  // Moat and management scores adjust the base value
  const qualityMultiplier = 1 + (moatScore + managementScore - 10) / 20; // -0.5 to +0.5
  intrinsicValue *= qualityMultiplier;

  // Step 5: Apply Margin of Safety
  const fairValueWithMoS = intrinsicValue * (1 - marginOfSafety / 100);

  // Per-share calculation (assume 1B shares for demo; make dynamic in real app)
  const sharesOutstanding = 1_000_000_000;
  const fairValuePerShare = fairValueWithMoS / sharesOutstanding;
  const currentPerShare = currentPrice || 0;

  const impliedUpside =
    currentPerShare > 0
      ? ((fairValuePerShare - currentPerShare) / currentPerShare) * 100
      : 0;

  // Step 6: Composite qualitative score (0-100)
  const quantitativeScore = Math.min(
    100,
    Math.max(
      0,
      (ownerEarnings > 0 ? 30 : 0) +
        (conservativeGrowth > 0.05 ? 25 : conservativeGrowth * 500) +
        moatScore * 2.5 +
        managementScore * 2.5,
    ),
  );

  // Step 7: Buffett-style verdict
  let buffettVerdict: BuffettResult["buffettVerdict"] = "Hold";
  if (impliedUpside > 50 && quantitativeScore > 70)
    buffettVerdict = "Strong Buy";
  else if (impliedUpside > 25 && quantitativeScore > 55) buffettVerdict = "Buy";
  else if (impliedUpside < -20 || quantitativeScore < 40)
    buffettVerdict = "Avoid";

  return {
    ownerEarnings,
    intrinsicValue,
    fairValueWithMoS,
    impliedUpside,
    qualitativeScore: Math.round(quantitativeScore),
    assumptions: [
      `Owner earnings: Rp ${ownerEarnings.toLocaleString("id-ID")}`,
      `Conservative growth: ${(conservativeGrowth * 100).toFixed(1)}%`,
      `Quality multiplier: ${qualityMultiplier.toFixed(2)}x`,
      `Margin of safety: ${marginOfSafety}%`,
      `Moat score: ${moatScore}/10, Management: ${managementScore}/10`,
    ],
    buffettVerdict,
  };
}
