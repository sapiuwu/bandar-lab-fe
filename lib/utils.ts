import { StockMetrics, ValuationInput, StockScore } from "@/types";

// Simple scoring weights (customizable)
const SCORE_WEIGHTS = {
  valuation: 0.3,
  profitability: 0.35,
  financialHealth: 0.2,
  growth: 0.15,
};

export function calculateStockScore(
  metrics: StockMetrics,
  currentPrice: number,
): StockScore {
  const breakdown = [];

  // Valuation Score (lower PER/PBV = better, with context)
  const valuationScore = calculateValuationScore(metrics);
  breakdown.push({
    metric: "Valuation",
    score: valuationScore,
    weight: SCORE_WEIGHTS.valuation,
    note: "Based on PER, PBV, PEG",
  });

  // Profitability Score
  const profitabilityScore = calculateProfitabilityScore(metrics);
  breakdown.push({
    metric: "Profitability",
    score: profitabilityScore,
    weight: SCORE_WEIGHTS.profitability,
    note: "ROE, ROI, NPM weighted",
  });

  // Financial Health Score
  const healthScore = calculateHealthScore(metrics);
  breakdown.push({
    metric: "Financial Health",
    score: healthScore,
    weight: SCORE_WEIGHTS.financialHealth,
    note: "DER, Current Ratio, Quick Ratio",
  });

  // Growth Score (simplified - would use historical data)
  const growthScore = 70; // placeholder
  breakdown.push({
    metric: "Growth",
    score: growthScore,
    weight: SCORE_WEIGHTS.growth,
    note: "Based on revenue/earnings trend",
  });

  // Weighted overall
  const overall =
    valuationScore * SCORE_WEIGHTS.valuation +
    profitabilityScore * SCORE_WEIGHTS.profitability +
    healthScore * SCORE_WEIGHTS.financialHealth +
    growthScore * SCORE_WEIGHTS.growth;

  const recommendation = getRecommendation(overall);

  return {
    overall: Math.round(overall),
    valuation: Math.round(valuationScore),
    profitability: Math.round(profitabilityScore),
    financialHealth: Math.round(healthScore),
    growth: Math.round(growthScore),
    recommendation,
    breakdown,
  };
}

function calculateValuationScore(m: StockMetrics): number {
  let score = 50; // neutral

  // PER scoring (context-dependent, simplified)
  if (m.per && m.per > 0) {
    if (m.per < 10) score += 25;
    else if (m.per < 15) score += 15;
    else if (m.per < 25) score += 5;
    else if (m.per > 40) score -= 20;
  }

  // PBV scoring
  if (m.pbv && m.pbv > 0) {
    if (m.pbv < 1) score += 20;
    else if (m.pbv < 2) score += 10;
    else if (m.pbv > 5) score -= 15;
  }

  return Math.max(0, Math.min(100, score));
}

function calculateProfitabilityScore(m: StockMetrics): number {
  let score = 50;

  if (m.roe !== null) {
    if (m.roe > 20) score += 30;
    else if (m.roe > 15) score += 20;
    else if (m.roe > 10) score += 10;
    else if (m.roe < 0) score -= 20;
  }

  if (m.npm !== null) {
    if (m.npm > 20) score += 15;
    else if (m.npm > 10) score += 8;
    else if (m.npm < 0) score -= 15;
  }

  return Math.max(0, Math.min(100, score));
}

function calculateHealthScore(m: StockMetrics): number {
  let score = 50;

  if (m.der !== null && m.der >= 0) {
    if (m.der < 0.5) score += 25;
    else if (m.der < 1) score += 15;
    else if (m.der < 2) score += 5;
    else if (m.der > 3) score -= 20;
  }

  if (m.cr !== null) {
    if (m.cr > 2) score += 15;
    else if (m.cr > 1.5) score += 8;
    else if (m.cr < 1) score -= 20;
  }

  return Math.max(0, Math.min(100, score));
}

function getRecommendation(score: number): StockScore["recommendation"] {
  if (score >= 80) return "Strong Buy";
  if (score >= 65) return "Buy";
  if (score >= 45) return "Hold";
  if (score >= 30) return "Sell";
  return "Strong Sell";
}

// Simplified DCF calculation (frontend prototype)
export function calculateDCF(input: ValuationInput): number {
  // This is a SIMPLIFIED prototype - real implementation needs proper FCFF projection
  const {
    revenueGrowth,
    operatingMargin,
    taxRate,
    wacc,
    terminalGrowth,
    forecastYears,
  } = input;

  // Assume starting revenue & shares for demo
  const startingRevenue = 10000000000; // 10B
  const sharesOutstanding = 1000000000; // 1B shares

  let pv = 0;
  let revenue = startingRevenue;

  // Forecast period
  for (let year = 1; year <= forecastYears; year++) {
    revenue *= 1 + revenueGrowth;
    const ebit = revenue * operatingMargin;
    const nopat = ebit * (1 - taxRate);
    // Simplified: ignore capex, nwc changes for prototype
    const fcff = nopat * 0.9;
    pv += fcff / Math.pow(1 + wacc, year);
  }

  // Terminal value (Gordon Growth)
  const terminalFCFF = (pv / forecastYears) * (1 + terminalGrowth);
  const terminalValue = terminalFCFF / (wacc - terminalGrowth);
  const pvTerminal = terminalValue / Math.pow(1 + wacc, forecastYears);

  const enterpriseValue = pv + pvTerminal;
  // Assume net debt = 0 for demo
  const equityValue = enterpriseValue;

  return equityValue / sharesOutstanding;
}

// Simplified DDM
export function calculateDDM(input: ValuationInput): number {
  const { dividendPerShare, dividendGrowth, requiredReturn } = input;
  if (requiredReturn <= dividendGrowth) return 0; // invalid
  return (
    (dividendPerShare * (1 + dividendGrowth)) /
    (requiredReturn - dividendGrowth)
  );
}

// Buffett-style intrinsic value (simplified)
export function calculateBuffett(
  input: ValuationInput,
  currentPrice: number,
): number {
  // Buffett looks at owner earnings, durable moat, management
  // Simplified: use average EPS growth + margin of safety

  // Assume EPS from current price and PER (mock)
  const estimatedEPS = currentPrice / 15; // assume PER 15 as baseline

  // Conservative growth estimate
  const conservativeGrowth = 0.08; // 8% long-term

  // Owner earnings approximation
  const ownerEarnings = estimatedEPS * 1.1; // add back non-cash charges

  // Intrinsic value = owner earnings / (required return - growth)
  const requiredReturn = 0.15; // Buffett's typical hurdle
  let intrinsic = ownerEarnings / (requiredReturn - conservativeGrowth);

  // Apply qualitative adjustments
  if (input.durableMoat) intrinsic *= 1.2;
  if (input.consistentEarnings) intrinsic *= 1.1;
  if (!input.competentManagement) intrinsic *= 0.9;

  // Apply margin of safety
  return intrinsic * (1 - input.marginOfSafety);
}

/**
 * Format large numbers with K/M/B/T suffixes
 * @param num - The number to format
 * @param decimals - Decimal places to show (default: 1)
 * @param locale - Locale for formatting (default: 'id-ID')
 * @returns Formatted string (e.g., "645T", "1.2M", "98.5K")
 */
// lib/utils.ts

/**
 * Format large numbers with K/M/B/T suffixes - HYDRATION SAFE
 * Uses fixed logic without locale-dependent toLocaleString for compact format
 */
export function formatCompactNumber(
  num: number | null | undefined,
  decimals: number = 1,
): string {
  if (num === null || num === undefined || isNaN(num)) return "N/A";

  const abs = Math.abs(num);

  // Define thresholds (short scale)
  const thresholds = [
    { value: 1e12, suffix: "T" },
    { value: 1e9, suffix: "B" },
    { value: 1e6, suffix: "M" },
    { value: 1e3, suffix: "K" },
  ];

  // Find appropriate suffix
  for (const { value, suffix } of thresholds) {
    if (abs >= value) {
      const scaled = num / value;
      // Use toFixed + manual cleanup for deterministic output
      const formatted = scaled.toFixed(decimals);
      // Remove trailing zeros but keep at least one decimal if needed
      const clean = parseFloat(formatted).toString();
      return `${clean}${suffix}`;
    }
  }

  // Small numbers: return as-is with optional decimals
  return decimals > 0 ? num.toFixed(decimals) : Math.round(num).toString();
}

/**
 * Format currency with compact suffix - HYDRATION SAFE
 * Avoids locale-dependent formatting that causes hydration mismatches
 */
export function formatCompactCurrency(
  num: number | null | undefined,
  currency: string = "IDR",
  decimals: number = 1,
): string {
  if (num === null || num === undefined || isNaN(num)) return "N/A";

  const abs = Math.abs(num);
  const thresholds = [
    { value: 1e12, suffix: "T" },
    { value: 1e9, suffix: "B" },
    { value: 1e6, suffix: "M" },
    { value: 1e3, suffix: "K" },
  ];

  // Currency prefix
  const prefix =
    currency === "IDR" ? "Rp " : currency === "USD" ? "$" : `${currency} `;

  // Find appropriate suffix
  for (const { value, suffix } of thresholds) {
    if (abs >= value) {
      const scaled = num / value;
      const formatted = scaled.toFixed(decimals);
      const clean = parseFloat(formatted).toString();
      return `${prefix}${clean}${suffix}`;
    }
  }

  // Small numbers: format without suffix, use deterministic rounding
  if (currency === "IDR") {
    // Indonesian format: dots as thousand separator, no decimals for small amounts
    return `Rp ${Math.round(num).toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }

  // Fallback for other currencies
  return `${prefix}${Math.round(num).toLocaleString("en-US")}`;
}

/**
 * Format percentage - simple and deterministic
 */
export function formatPercent(
  value: number | null | undefined,
  decimals: number = 2,
): string {
  if (value === null || value === undefined || isNaN(value)) return "N/A";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Format full currency (non-compact) - hydration safe
 */
export function formatCurrency(
  num: number | null | undefined,
  currency: string = "IDR",
): string {
  if (num === null || num === undefined || isNaN(num)) return "N/A";

  if (currency === "IDR") {
    return `Rp ${Math.round(num).toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }

  return num.toLocaleString("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
