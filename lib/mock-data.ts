import { StockBasic, StockMetrics, ValuationResult, StockScore } from "@/types";

// ============================================================================
// 🔐 SEEDED RANDOM UTIL (Deterministic - same output every time)
// ============================================================================
function createSeededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// ============================================================================
// 📦 BASE MOCK STOCK (BBCA)
// ============================================================================
export const mockStock = {
  basic: {
    symbol: "BBCA",
    name: "Bank Central Asia Tbk",
    sector: "Financials",
    price: 9875,
    currency: "IDR",
    change: 125,
    changePercent: 1.28,
    lastUpdated: "2026-01-01T00:00:00.000Z", // ✅ Fixed timestamp for hydration safety
  } as StockBasic,
  metrics: {
    per: 24.5,
    pbv: 4.2,
    pcf: 18.3,
    peg: 1.8,
    roe: 18.5,
    roi: 12.3,
    npm: 42.1,
    gpm: null,
    der: 4.8,
    cr: null,
    quickRatio: null,
    marketCap: 1215000000000000,
    freeFloat: 48.5,
    volume: 45200000,
    avgVolume: 38500000,
    operatingCashFlow: 45000000000000,
    freeCashFlow: 38000000000000,
    fcfYield: 3.1,
  } as StockMetrics,
  valuations: [
    {
      method: "DCF",
      fairValue: 11200,
      upside: 13.4,
      assumption: "10% growth, 12% WACC",
    },
    {
      method: "DDM",
      fairValue: 9500,
      upside: -3.8,
      assumption: "Div growth 5%",
    },
    {
      method: "Buffett",
      fairValue: 10800,
      upside: 9.4,
      assumption: "MoS 25%, Moat: Yes",
    },
  ] as ValuationResult[],
  score: {
    overall: 72,
    valuation: 65,
    profitability: 85,
    financialHealth: 60,
    growth: 70,
    recommendation: "Buy",
    breakdown: [],
  } as StockScore,
};

// ============================================================================
// 📦 PREDEFINED MOCK STOCKS (BBCA, BBRI, TLKM, ASII, UNVR)
// ============================================================================
export const mockStocks: (typeof mockStock)[] = [
  mockStock,
  {
    basic: {
      symbol: "BBRI",
      name: "Bank Rakyat Indonesia Tbk",
      sector: "Financials",
      price: 5200,
      currency: "IDR",
      change: -50,
      changePercent: -0.95,
      lastUpdated: "2026-01-01T00:00:00.000Z",
    },
    metrics: {
      per: 12.3,
      pbv: 2.1,
      pcf: 8.5,
      peg: 1.2,
      roe: 16.8,
      roi: 10.5,
      npm: 38.2,
      gpm: null,
      der: 5.2,
      cr: null,
      quickRatio: null,
      marketCap: 645000000000000,
      freeFloat: 43.2,
      volume: 89500000,
      avgVolume: 72000000,
      operatingCashFlow: 28000000000000,
      freeCashFlow: 22000000000000,
      fcfYield: 3.4,
    },
    valuations: [
      {
        method: "DCF",
        fairValue: 5800,
        upside: 11.5,
        assumption: "8% growth, 13% WACC",
      },
      {
        method: "DDM",
        fairValue: 5100,
        upside: -1.9,
        assumption: "Div growth 4%",
      },
      {
        method: "Buffett",
        fairValue: 5600,
        upside: 7.7,
        assumption: "MoS 25%, Moat: Yes",
      },
    ],
    score: {
      overall: 68,
      valuation: 70,
      profitability: 75,
      financialHealth: 55,
      growth: 65,
      recommendation: "Buy",
      breakdown: [],
    },
  },
  {
    basic: {
      symbol: "TLKM",
      name: "Telkom Indonesia Tbk",
      sector: "Telecom",
      price: 3850,
      currency: "IDR",
      change: 25,
      changePercent: 0.65,
      lastUpdated: "2026-01-01T00:00:00.000Z",
    },
    metrics: {
      per: 18.2,
      pbv: 2.8,
      pcf: 12.1,
      peg: 2.1,
      roe: 14.2,
      roi: 9.8,
      npm: 22.5,
      gpm: 65.3,
      der: 1.2,
      cr: 1.8,
      quickRatio: 1.5,
      marketCap: 378000000000000,
      freeFloat: 47.8,
      volume: 42000000,
      avgVolume: 38000000,
      operatingCashFlow: 18500000000000,
      freeCashFlow: 12000000000000,
      fcfYield: 3.2,
    },
    valuations: [
      {
        method: "DCF",
        fairValue: 4100,
        upside: 6.5,
        assumption: "5% growth, 11% WACC",
      },
      {
        method: "DDM",
        fairValue: 3900,
        upside: 1.3,
        assumption: "Div growth 3%",
      },
      {
        method: "Buffett",
        fairValue: 3700,
        upside: -3.9,
        assumption: "MoS 25%, Moat: No",
      },
    ],
    score: {
      overall: 55,
      valuation: 50,
      profitability: 65,
      financialHealth: 70,
      growth: 45,
      recommendation: "Hold",
      breakdown: [],
    },
  },
  {
    basic: {
      symbol: "ASII",
      name: "Astra International Tbk",
      sector: "Consumer Cyclical",
      price: 6100,
      currency: "IDR",
      change: 75,
      changePercent: 1.24,
      lastUpdated: "2026-01-01T00:00:00.000Z",
    },
    metrics: {
      per: 14.8,
      pbv: 1.9,
      pcf: 10.2,
      peg: 1.5,
      roe: 13.5,
      roi: 11.2,
      npm: 8.9,
      gpm: 22.1,
      der: 0.9,
      cr: 1.4,
      quickRatio: 0.8,
      marketCap: 245000000000000,
      freeFloat: 49.5,
      volume: 28000000,
      avgVolume: 24000000,
      operatingCashFlow: 15200000000000,
      freeCashFlow: 9800000000000,
      fcfYield: 4.0,
    },
    valuations: [
      {
        method: "DCF",
        fairValue: 6800,
        upside: 11.5,
        assumption: "7% growth, 12% WACC",
      },
      {
        method: "DDM",
        fairValue: 6200,
        upside: 1.6,
        assumption: "Div growth 5%",
      },
      {
        method: "Buffett",
        fairValue: 6500,
        upside: 6.6,
        assumption: "MoS 25%, Moat: Yes",
      },
    ],
    score: {
      overall: 63,
      valuation: 60,
      profitability: 70,
      financialHealth: 65,
      growth: 62,
      recommendation: "Buy",
      breakdown: [],
    },
  },
  {
    basic: {
      symbol: "UNVR",
      name: "Unilever Indonesia Tbk",
      sector: "Consumer Defensive",
      price: 4200,
      currency: "IDR",
      change: -30,
      changePercent: -0.71,
      lastUpdated: "2026-01-01T00:00:00.000Z",
    },
    metrics: {
      per: 32.5,
      pbv: 18.2,
      pcf: 28.1,
      peg: 4.2,
      roe: 58.2,
      roi: 42.1,
      npm: 18.5,
      gpm: 52.3,
      der: 0.3,
      cr: 2.1,
      quickRatio: 1.8,
      marketCap: 98000000000000,
      freeFloat: 15.2,
      volume: 8500000,
      avgVolume: 7200000,
      operatingCashFlow: 8200000000000,
      freeCashFlow: 7100000000000,
      fcfYield: 7.2,
    },
    valuations: [
      {
        method: "DCF",
        fairValue: 3800,
        upside: -9.5,
        assumption: "3% growth, 10% WACC",
      },
      {
        method: "DDM",
        fairValue: 4100,
        upside: -2.4,
        assumption: "Div growth 2%",
      },
      {
        method: "Buffett",
        fairValue: 3500,
        upside: -16.7,
        assumption: "MoS 25%, Moat: Yes",
      },
    ],
    score: {
      overall: 48,
      valuation: 35,
      profitability: 85,
      financialHealth: 80,
      growth: 25,
      recommendation: "Hold",
      breakdown: [],
    },
  },
];

// ============================================================================
// 🎲 DETERMINISTIC MOCK STOCK GENERATOR (Seeded Random)
// ============================================================================
const SECTORS = [
  "Financials",
  "Mining",
  "Tech",
  "Consumer Defensive",
  "Infrastructure",
  "Energy",
];

const SECTOR_PREFIXES: Record<string, string[]> = {
  Financials: ["B", "BNG", "BRIS"],
  Mining: ["ADRO", "PTBA", "ITMG"],
  Tech: ["GOTO", "BUKA", "MTLA"],
  "Consumer Defensive": ["ICBP", "INDF", "MYOR"],
  Infrastructure: ["JSMR", "TLKM", "EXCL"],
  Energy: ["PGAS", "MEDC", "UNTR"],
};

export function generateExtraMockStocks(
  count: number,
  seed = 12345,
): (typeof mockStock)[] {
  const random = createSeededRandom(seed); // ✅ Same seed = same values every render
  const extraStocks: (typeof mockStock)[] = [];

  for (let i = 0; i < count; i++) {
    const sector = SECTORS[i % SECTORS.length];
    const prefix = SECTOR_PREFIXES[sector]?.[0] || "IDX";
    const symbol = `${prefix}${String(i + 1).padStart(2, "0")}`;

    // ✅ Use seeded random for deterministic values
    const price = Math.floor(random() * 15000) + 50;
    const per = Math.floor(random() * 30) + 5;
    const roe = Math.floor(random() * 25) + 2;
    const score = Math.floor(random() * 40) + 40;

    extraStocks.push({
      basic: {
        symbol,
        name: `${sector} Corp ${i + 1}`,
        sector,
        price,
        currency: "IDR",
        change: Math.floor(random() * 200) - 100,
        changePercent: Number((random() * 6 - 3).toFixed(2)),
        lastUpdated: "2026-01-01T00:00:00.000Z", // ✅ Fixed timestamp
      },
      metrics: {
        per,
        pbv: Number((random() * 5 + 0.5).toFixed(2)),
        pcf: 0,
        peg: 0,
        roe,
        roi: Number((roe * 0.6).toFixed(2)),
        npm: Number((random() * 30).toFixed(2)),
        gpm: 0,
        der: Number((random() * 2).toFixed(2)),
        cr: 0,
        quickRatio: 0,
        marketCap: price * (Math.floor(random() * 10) + 1) * 1e9,
        freeFloat: Math.floor(random() * 60) + 15,
        volume: 0,
        avgVolume: 0,
        operatingCashFlow: 0,
        freeCashFlow: 0,
        fcfYield: 0,
      },
      valuations: [],
      score: {
        overall: score,
        valuation: Math.floor(random() * 30) + 40,
        profitability: Math.floor(roe * 2),
        financialHealth: Math.floor(random() * 40) + 30,
        growth: Math.floor(random() * 30) + 30,
        recommendation: score > 65 ? "Buy" : "Hold",
        breakdown: [],
      },
    });
  }
  return extraStocks;
}

// ============================================================================
// 📦 EXPORT COMBINED STOCKS (Static + Generated)
// ============================================================================
export const allStocks = [...mockStocks, ...generateExtraMockStocks(50, 12345)];

// ============================================================================
// 🔍 HELPERS
// ============================================================================
export function findMockStock(symbol: string): typeof mockStock | null {
  const upper = symbol.toUpperCase();
  return allStocks.find((s) => s.basic.symbol.toUpperCase() === upper) || null;
}

export const mockWatchlist = allStocks.map((s) => ({
  ...s.basic,
  score: s.score,
  sector: s.basic.sector,
}));
