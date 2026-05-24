// lib/reports/generateReport.ts

import { findMockStock, allStocks } from "@/lib/mock-data";
import { calculateDCF } from "@/lib/valuation/dcf";
import { calculateDDM } from "@/lib/valuation/ddm";
import { calculateBuffett } from "@/lib/valuation/buffett";

export interface ReportData {
  // Basic Info
  symbol: string;
  name: string;
  sector: string;
  currentPrice: number;
  currency: string;
  lastUpdated: string;

  // Executive Summary
  overallScore: number;
  recommendation: "Strong Buy" | "Buy" | "Hold" | "Sell" | "Strong Sell";
  keyHighlights: string[];
  keyRisks: string[];

  // Metrics Snapshot
  valuation: {
    per: number | null;
    pbv: number | null;
    pcf: number | null;
    peg: number | null;
  };
  profitability: {
    roe: number | null;
    roi: number | null;
    npm: number | null;
  };
  financialHealth: {
    der: number | null;
    currentRatio: number | null;
  };

  // Valuation Results
  valuations: {
    method: string;
    fairValue: number;
    upside: number;
    verdict: string;
    assumptions: string[];
  }[];
  consensusFairValue: number;
  consensusUpside: number;

  // Technical Indicators (mock for now)
  technicals: {
    trend: "Bullish" | "Bearish" | "Neutral";
    support: number;
    resistance: number;
    rsi: number;
    macd: "Bullish" | "Bearish" | "Neutral";
  };

  // Risk Assessment
  riskScore: number; // 0-100 (lower = riskier)
  riskFactors: {
    category: string;
    level: "Low" | "Medium" | "High";
    description: string;
  }[];

  // Moat Analysis
  moat: {
    width: "Wide" | "Narrow" | "None";
    sources: string[];
    sustainability: "High" | "Medium" | "Low";
  };

  // Price History (for charts)
  priceHistory: { date: string; price: number }[];

  // Peer Comparison
  peers: {
    symbol: string;
    name: string;
    per: number | null;
    pbv: number | null;
    roe: number | null;
    upside: number;
  }[];
}

export function generateReport(
  symbol: string,
  currentPrice?: number,
): ReportData | null {
  const stock = findMockStock(symbol);
  if (!stock) return null;

  const price = currentPrice || stock.basic.price;

  // Calculate valuations
  const dcfInputs = {
    revenue: stock.metrics.marketCap * 0.3, // Mock: revenue ~30% of market cap
    operatingMargin: stock.metrics.npm || 15,
    taxRate: 25,
    revenueGrowth5y: 10,
    revenueGrowthTerminal: 3,
    capexPercent: 8,
    nwcPercent: 5,
    wacc: 12,
    cash: stock.metrics.operatingCashFlow * 0.5,
    debt: stock.metrics.marketCap * 0.1,
    sharesOutstanding: stock.metrics.marketCap / price,
  };

  const dcfResult = calculateDCF(dcfInputs, price);

  const ddmResult =
    stock.metrics.freeCashFlow > 0
      ? calculateDDM(
          {
            dividendPerShare: price * 0.03, // Mock: 3% yield
            dividendGrowth5y: 5,
            dividendGrowthTerminal: 3,
            requiredReturn: 12,
          },
          price,
        )
      : null;

  const buffettResult = calculateBuffett(
    {
      netIncome: stock.metrics.marketCap * 0.08, // Mock: 8% net margin on market cap
      depreciation: stock.metrics.operatingCashFlow * 0.2,
      capex: stock.metrics.operatingCashFlow * 0.3,
      workingCapitalChange: 0,
      earningsGrowth10y: stock.score.growth,
      moatScore: stock.score.financialHealth > 70 ? 8 : 5,
      managementScore: stock.score.profitability > 70 ? 9 : 6,
      marginOfSafety: 25,
      requiredReturn: 15,
    },
    price,
  );

  // Consensus fair value (weighted average)
  const valuationResults = [
    {
      method: "DCF",
      fairValue: dcfResult.fairValuePerShare,
      upside: dcfResult.impliedUpside,
      assumptions: dcfResult.assumptions,
    },
    ...(ddmResult
      ? [
          {
            method: "DDM",
            fairValue: ddmResult.fairValuePerShare,
            upside: ddmResult.impliedUpside,
            assumptions: ddmResult.assumptions,
          },
        ]
      : []),
    {
      method: "Buffett",
      fairValue: buffettResult.fairValueWithMoS / dcfInputs.sharesOutstanding,
      upside: buffettResult.impliedUpside,
      assumptions: buffettResult.assumptions,
    },
  ].map((v) => ({
    ...v,
    verdict:
      v.upside >= 20
        ? "Undervalued"
        : v.upside >= 0
          ? "Fair Value"
          : "Overvalued",
  }));

  const consensusFairValue =
    valuationResults.reduce((sum, v) => sum + v.fairValue, 0) /
    valuationResults.length;
  const consensusUpside = ((consensusFairValue - price) / price) * 100;

  // Generate highlights & risks
  const keyHighlights: string[] = [];
  const keyRisks: string[] = [];

  if (stock.metrics.roe && stock.metrics.roe > 15)
    keyHighlights.push(`Strong ROE of ${stock.metrics.roe.toFixed(1)}%`);
  if (stock.metrics.npm && stock.metrics.npm > 20)
    keyHighlights.push(
      `Healthy net margin of ${stock.metrics.npm.toFixed(1)}%`,
    );
  if (stock.metrics.der && stock.metrics.der < 1)
    keyHighlights.push("Conservative debt levels");
  if (consensusUpside > 15)
    keyHighlights.push(
      `Trading at ${Math.abs(consensusUpside).toFixed(0)}% discount to fair value`,
    );

  if (stock.metrics.der && stock.metrics.der > 2)
    keyRisks.push("High debt-to-equity ratio");
  if (stock.metrics.per && stock.metrics.per > 30)
    keyRisks.push("Elevated P/E ratio vs sector");
  if (stock.basic.changePercent < -5) keyRisks.push("Recent price weakness");
  if (!stock.metrics.freeCashFlow || stock.metrics.freeCashFlow < 0)
    keyRisks.push("Negative free cash flow");

  // Mock price history (30 days)
  const priceHistory = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    // Random walk around current price
    const randomFactor = 1 + Math.sin(i * 0.5) * 0.03 + (i - 15) * 0.002;
    return {
      date: date.toISOString().split("T")[0],
      price: Math.round(price * randomFactor),
    };
  });

  // Peer comparison (mock)
  const peers = allStocks
    .filter(
      (s) => s.basic.sector === stock.basic.sector && s.basic.symbol !== symbol,
    )
    .slice(0, 4)
    .map((peer) => {
      const peerPrice = peer.basic.price;
      const peerDCF = calculateDCF(
        { ...dcfInputs, revenue: peer.metrics.marketCap * 0.3 },
        peerPrice,
      );
      return {
        symbol: peer.basic.symbol,
        name: peer.basic.name,
        per: peer.metrics.per,
        pbv: peer.metrics.pbv,
        roe: peer.metrics.roe,
        upside: ((peerDCF.fairValuePerShare - peerPrice) / peerPrice) * 100,
      };
    });

  return {
    symbol: stock.basic.symbol,
    name: stock.basic.name,
    sector: stock.basic.sector,
    currentPrice: price,
    currency: stock.basic.currency,
    lastUpdated: new Date().toISOString(),

    overallScore: stock.score.overall,
    recommendation: stock.score.recommendation,
    keyHighlights,
    keyRisks,

    valuation: {
      per: stock.metrics.per,
      pbv: stock.metrics.pbv,
      pcf: stock.metrics.pcf,
      peg: stock.metrics.peg,
    },
    profitability: {
      roe: stock.metrics.roe,
      roi: stock.metrics.roi,
      npm: stock.metrics.npm,
    },
    financialHealth: {
      der: stock.metrics.der,
      currentRatio: stock.metrics.cr,
    },

    valuations: valuationResults,
    consensusFairValue,
    consensusUpside,

    technicals: {
      trend: stock.basic.changePercent >= 0 ? "Bullish" : "Bearish",
      support: Math.round(price * 0.92),
      resistance: Math.round(price * 1.08),
      rsi: 45 + Math.round(Math.random() * 20), // Mock RSI 45-65
      macd: "Neutral",
    },

    riskScore: Math.max(
      20,
      Math.min(
        80,
        50 + (stock.metrics.der || 0) * 5 - (stock.metrics.roe || 0) * 2,
      ),
    ),
    riskFactors: [
      {
        category: "Market Risk",
        level: "Medium",
        description: "Exposure to broader market volatility",
      },
      {
        category: "Sector Risk",
        level: stock.basic.sector === "Financials" ? "High" : "Medium",
        description: `Regulatory and interest rate sensitivity in ${stock.basic.sector}`,
      },
      {
        category: "Company-Specific",
        level: stock.score.financialHealth < 50 ? "High" : "Low",
        description: "Execution risk on growth initiatives",
      },
      {
        category: "Liquidity Risk",
        level: stock.metrics.freeFloat < 30 ? "High" : "Low",
        description: `${stock.metrics.freeFloat.toFixed(1)}% free float may impact large trades`,
      },
    ],

    moat: {
      width:
        stock.score.profitability > 75
          ? "Wide"
          : stock.score.profitability > 50
            ? "Narrow"
            : "None",
      sources:
        stock.metrics.npm && stock.metrics.npm > 30
          ? ["Pricing Power", "Brand Strength"]
          : stock.metrics.roe && stock.metrics.roe > 20
            ? ["Cost Advantages", "Scale"]
            : ["Limited Moat"],
      sustainability: stock.score.financialHealth > 70 ? "High" : "Medium",
    },

    priceHistory,
    peers,
  };
}
