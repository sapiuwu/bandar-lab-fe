import { notFound } from "next/navigation";
import { findMockStock, allStocks } from "@/lib/mock-data";
import {
  MetricsDetail,
  type StockMetricsDetail,
} from "@/components/stock/MetricsDetail";

interface PageProps {
  params: Promise<{ symbol: string }>;
}

// Helper: Transform mock stock data to detailed metrics format
function transformToMetricsDetail(symbol: string): StockMetricsDetail | null {
  const stock = findMockStock(symbol);
  if (!stock) return null;

  // Mock sector averages (in real app, fetch from backend)
  const sector = stock.basic.sector;
  const sectorStocks = allStocks.filter((s) => s.basic.sector === sector);
  const sectorAverages = {
    valuation: {
      per:
        sectorStocks.reduce((sum, s) => sum + (s.metrics.per || 0), 0) /
          sectorStocks.filter((s) => s.metrics.per).length || null,
    },
    profitability: {
      roe:
        sectorStocks.reduce((sum, s) => sum + (s.metrics.roe || 0), 0) /
          sectorStocks.filter((s) => s.metrics.roe).length || null,
    },
  };

  return {
    // Basic Info
    symbol: stock.basic.symbol,
    name: stock.basic.name,
    sector: stock.basic.sector,
    lastUpdated: stock.basic.lastUpdated,

    // Market Data
    price: stock.basic.price,
    marketCap: stock.metrics.marketCap,
    volume: stock.metrics.volume,
    avgVolume: stock.metrics.avgVolume,
    freeFloat: stock.metrics.freeFloat,
    sharesOutstanding: stock.metrics.marketCap / stock.basic.price,

    // Valuation Ratios
    valuation: {
      per: stock.metrics.per,
      pbv: stock.metrics.pbv,
      pcf: stock.metrics.pcf,
      peg: stock.metrics.peg,
      psr: null, // Mock: not in base data
      evEbitda: null,
    },

    // Profitability
    profitability: {
      roe: stock.metrics.roe,
      roi: stock.metrics.roi,
      roa: null,
      npm: stock.metrics.npm,
      gpm: stock.metrics.gpm,
      opm: null,
    },

    // Financial Health
    financialHealth: {
      der: stock.metrics.der,
      currentRatio: stock.metrics.cr,
      quickRatio: stock.metrics.quickRatio,
      interestCoverage: null,
      debtToAssets: null,
    },

    // Growth Metrics (mock historical data)
    growth: {
      revenueGrowth1y: 12.5,
      revenueGrowth3y: 10.2,
      earningsGrowth1y: 8.3,
      earningsGrowth3y: 9.1,
      bookValueGrowth: 7.8,
    },

    // Cash Flow
    cashFlow: {
      operatingCashFlow: stock.metrics.operatingCashFlow,
      freeCashFlow: stock.metrics.freeCashFlow,
      fcfYield: stock.metrics.fcfYield,
      capex: stock.metrics.operatingCashFlow - stock.metrics.freeCashFlow,
      fcfPerShare:
        stock.metrics.freeCashFlow /
        (stock.metrics.marketCap / stock.basic.price),
    },

    // Dividend Data (mock)
    dividends: {
      dividendYield: stock.basic.price > 0 ? 3.2 : null,
      dividendPerShare: stock.basic.price * 0.032,
      payoutRatio: 45.2,
      dividendGrowth5y: 5.1,
    },

    // Efficiency (mock)
    efficiency: {
      assetTurnover: 0.85,
      inventoryTurnover: 6.2,
      receivablesTurnover: 8.4,
      workingCapitalTurnover: 4.1,
    },
  };
}

export default async function MetricsPage({ params }: PageProps) {
  const { symbol } = await params;
  const metricsData = transformToMetricsDetail(symbol.toUpperCase());

  if (!metricsData) {
    notFound();
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <MetricsDetail data={metricsData} />
    </div>
  );
}
