"use client";

import { MetricRow, type MetricRowProps } from "./MetricRow";
import { MetricGroup } from "./MetricGroup";
import { formatCompactCurrency, formatPercent } from "@/lib/utils";

export interface StockMetricsDetail {
  // Basic Info
  symbol: string;
  name: string;
  sector: string;
  lastUpdated: string;

  // Market Data
  price: number;
  marketCap: number;
  volume: number;
  avgVolume: number;
  freeFloat: number;
  sharesOutstanding: number;

  // Valuation Ratios
  valuation: {
    per: number | null;
    pbv: number | null;
    pcf: number | null;
    peg: number | null;
    psr: number | null;
    evEbitda: number | null;
  };

  // Profitability
  profitability: {
    roe: number | null;
    roi: number | null;
    roa: number | null;
    npm: number | null;
    gpm: number | null;
    opm: number | null;
  };

  // Financial Health
  financialHealth: {
    der: number | null;
    currentRatio: number | null;
    quickRatio: number | null;
    interestCoverage: number | null;
    debtToAssets: number | null;
  };

  // Growth Metrics
  growth: {
    revenueGrowth1y: number | null;
    revenueGrowth3y: number | null;
    earningsGrowth1y: number | null;
    earningsGrowth3y: number | null;
    bookValueGrowth: number | null;
  };

  // Cash Flow
  cashFlow: {
    operatingCashFlow: number;
    freeCashFlow: number;
    fcfYield: number | null;
    capex: number;
    fcfPerShare: number | null;
  };

  // Dividend Data
  dividends: {
    dividendYield: number | null;
    dividendPerShare: number | null;
    payoutRatio: number | null;
    dividendGrowth5y: number | null;
  };

  // Efficiency
  efficiency: {
    assetTurnover: number | null;
    inventoryTurnover: number | null;
    receivablesTurnover: number | null;
    workingCapitalTurnover: number | null;
  };
}

interface MetricsDetailProps {
  data: StockMetricsDetail;
  sectorAverages?: Partial<StockMetricsDetail>;
}

export function MetricsDetail({ data, sectorAverages }: MetricsDetailProps) {
  const metricGroups: Array<{
    title: string;
    icon: string;
    description?: string;
    metrics: MetricRowProps[];
  }> = [
    {
      title: "📊 Market Data",
      icon: "📈",
      description: "Current trading information and market capitalization",
      metrics: [
        { label: "Current Price", value: data.price, format: "currency" },
        { label: "Market Cap", value: data.marketCap, format: "currency" },
        { label: "Volume (Today)", value: data.volume, format: "number" },
        { label: "Avg Volume (30d)", value: data.avgVolume, format: "number" },
        { label: "Free Float", value: data.freeFloat, format: "percent" },
        {
          label: "Shares Outstanding",
          value: data.sharesOutstanding,
          format: "number",
        },
      ],
    },
    {
      title: "💵 Valuation Ratios",
      icon: "💰",
      description:
        "Price-based metrics to assess if stock is undervalued or overvalued",
      metrics: [
        {
          label: "P/E Ratio",
          value: data.valuation.per,
          format: "ratio",
          hint: "Price / Earnings. Lower may indicate undervaluation",
          status:
            data.valuation.per && data.valuation.per < 15
              ? "good"
              : data.valuation.per && data.valuation.per > 30
                ? "bad"
                : "neutral",
          benchmark: sectorAverages?.valuation?.per
            ? { value: sectorAverages.valuation.per, label: "Sector Avg" }
            : undefined,
        },
        {
          label: "P/BV Ratio",
          value: data.valuation.pbv,
          format: "ratio",
          hint: "Price / Book Value. <1 may signal undervaluation",
          status:
            data.valuation.pbv && data.valuation.pbv < 2
              ? "good"
              : data.valuation.pbv && data.valuation.pbv > 5
                ? "bad"
                : "neutral",
        },
        {
          label: "P/CF Ratio",
          value: data.valuation.pcf,
          format: "ratio",
          hint: "Price / Cash Flow. Cash-based valuation",
        },
        {
          label: "PEG Ratio",
          value: data.valuation.peg,
          format: "ratio",
          hint: "P/E adjusted for growth. <1 may indicate value",
          status:
            data.valuation.peg && data.valuation.peg < 1
              ? "good"
              : data.valuation.peg && data.valuation.peg > 2
                ? "bad"
                : "neutral",
        },
        {
          label: "PSR",
          value: data.valuation.psr,
          format: "ratio",
          hint: "Price / Sales Ratio",
        },
        {
          label: "EV/EBITDA",
          value: data.valuation.evEbitda,
          format: "ratio",
          hint: "Enterprise Value / EBITDA",
        },
      ],
    },
    {
      title: "📈 Profitability",
      icon: "💹",
      description: "How efficiently the company generates profits",
      metrics: [
        {
          label: "ROE",
          value: data.profitability.roe,
          format: "percent",
          hint: "Return on Equity. >15% is strong",
          status:
            data.profitability.roe && data.profitability.roe > 15
              ? "good"
              : data.profitability.roe && data.profitability.roe < 5
                ? "bad"
                : "neutral",
          benchmark: sectorAverages?.profitability?.roe
            ? { value: sectorAverages.profitability.roe, label: "Sector Avg" }
            : undefined,
        },
        {
          label: "ROI",
          value: data.profitability.roi,
          format: "percent",
          hint: "Return on Investment",
        },
        {
          label: "ROA",
          value: data.profitability.roa,
          format: "percent",
          hint: "Return on Assets",
        },
        {
          label: "Net Margin",
          value: data.profitability.npm,
          format: "percent",
          hint: "Net Profit / Revenue",
          status:
            data.profitability.npm && data.profitability.npm > 15
              ? "good"
              : data.profitability.npm && data.profitability.npm < 5
                ? "bad"
                : "neutral",
        },
        {
          label: "Gross Margin",
          value: data.profitability.gpm,
          format: "percent",
          hint: "Gross Profit / Revenue",
        },
        {
          label: "Operating Margin",
          value: data.profitability.opm,
          format: "percent",
          hint: "Operating Income / Revenue",
        },
      ],
    },
    {
      title: "🛡️ Financial Health",
      icon: "🔒",
      description: "Debt levels and liquidity position",
      metrics: [
        {
          label: "Debt/Equity",
          value: data.financialHealth.der,
          format: "ratio",
          hint: "Lower is generally safer. <1 is conservative",
          status:
            data.financialHealth.der && data.financialHealth.der < 1
              ? "good"
              : data.financialHealth.der && data.financialHealth.der > 2
                ? "bad"
                : "neutral",
        },
        {
          label: "Current Ratio",
          value: data.financialHealth.currentRatio,
          format: "ratio",
          hint: "Current Assets / Liabilities. >1.5 is healthy",
          status:
            data.financialHealth.currentRatio &&
            data.financialHealth.currentRatio > 1.5
              ? "good"
              : data.financialHealth.currentRatio &&
                  data.financialHealth.currentRatio < 1
                ? "bad"
                : "neutral",
        },
        {
          label: "Quick Ratio",
          value: data.financialHealth.quickRatio,
          format: "ratio",
          hint: "Acid-test: excludes inventory from current assets",
        },
        {
          label: "Interest Coverage",
          value: data.financialHealth.interestCoverage,
          format: "ratio",
          hint: "EBIT / Interest Expense. Higher = safer",
        },
        {
          label: "Debt/Assets",
          value: data.financialHealth.debtToAssets,
          format: "percent",
          hint: "Total Debt / Total Assets",
        },
      ],
    },
    {
      title: "🚀 Growth Metrics",
      icon: "📊",
      description: "Historical growth rates for revenue and earnings",
      metrics: [
        {
          label: "Revenue Growth (1Y)",
          value: data.growth.revenueGrowth1y,
          format: "percent",
          trend:
            data.growth.revenueGrowth1y && data.growth.revenueGrowth1y > 0
              ? "up"
              : "down",
        },
        {
          label: "Revenue Growth (3Y CAGR)",
          value: data.growth.revenueGrowth3y,
          format: "percent",
        },
        {
          label: "Earnings Growth (1Y)",
          value: data.growth.earningsGrowth1y,
          format: "percent",
          trend:
            data.growth.earningsGrowth1y && data.growth.earningsGrowth1y > 0
              ? "up"
              : "down",
        },
        {
          label: "Earnings Growth (3Y CAGR)",
          value: data.growth.earningsGrowth3y,
          format: "percent",
        },
        {
          label: "Book Value Growth",
          value: data.growth.bookValueGrowth,
          format: "percent",
        },
      ],
    },
    {
      title: "💧 Cash Flow Analysis",
      icon: "💵",
      description: "Cash generation and capital allocation",
      metrics: [
        {
          label: "Operating Cash Flow",
          value: data.cashFlow.operatingCashFlow,
          format: "currency",
        },
        {
          label: "Free Cash Flow",
          value: data.cashFlow.freeCashFlow,
          format: "currency",
        },
        {
          label: "FCF Yield",
          value: data.cashFlow.fcfYield,
          format: "percent",
          hint: "FCF / Market Cap. Higher = better value",
        },
        {
          label: "Capital Expenditures",
          value: data.cashFlow.capex,
          format: "currency",
        },
        {
          label: "FCF per Share",
          value: data.cashFlow.fcfPerShare,
          format: "currency",
        },
      ],
    },
    {
      title: "🎁 Dividend Data",
      icon: "💰",
      description: "Dividend payments and sustainability",
      metrics: [
        {
          label: "Dividend Yield",
          value: data.dividends.dividendYield,
          format: "percent",
        },
        {
          label: "Dividend per Share",
          value: data.dividends.dividendPerShare,
          format: "currency",
        },
        {
          label: "Payout Ratio",
          value: data.dividends.payoutRatio,
          format: "percent",
          hint: "Dividends / Net Income. <60% is sustainable",
          status:
            data.dividends.payoutRatio && data.dividends.payoutRatio < 60
              ? "good"
              : data.dividends.payoutRatio && data.dividends.payoutRatio > 90
                ? "warning"
                : "neutral",
        },
        {
          label: "Dividend Growth (5Y)",
          value: data.dividends.dividendGrowth5y,
          format: "percent",
        },
      ],
    },
    {
      title: "⚙️ Efficiency Ratios",
      icon: "🔧",
      description: "How well the company uses its assets",
      metrics: [
        {
          label: "Asset Turnover",
          value: data.efficiency.assetTurnover,
          format: "ratio",
          hint: "Revenue / Total Assets",
        },
        {
          label: "Inventory Turnover",
          value: data.efficiency.inventoryTurnover,
          format: "ratio",
          hint: "COGS / Average Inventory",
        },
        {
          label: "Receivables Turnover",
          value: data.efficiency.receivablesTurnover,
          format: "ratio",
          hint: "Revenue / Average Receivables",
        },
        {
          label: "Working Capital Turnover",
          value: data.efficiency.workingCapitalTurnover,
          format: "ratio",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            {data.symbol} • Detailed Metrics
          </h1>
          <p className="text-muted-foreground">
            {data.name} • {data.sector}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Updated:</span>
          <span className="font-medium">
            {new Date(data.lastUpdated).toLocaleDateString("id-ID")}
          </span>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-card rounded-lg border text-center">
          <p className="text-xs text-muted-foreground">P/E Ratio</p>
          <p className="text-lg font-bold">
            {data.valuation.per?.toFixed(2) ?? "N/A"}
          </p>
        </div>
        <div className="p-3 bg-card rounded-lg border text-center">
          <p className="text-xs text-muted-foreground">ROE</p>
          <p className="text-lg font-bold">
            {data.profitability.roe?.toFixed(1) ?? "N/A"}%
          </p>
        </div>
        <div className="p-3 bg-card rounded-lg border text-center">
          <p className="text-xs text-muted-foreground">Debt/Equity</p>
          <p className="text-lg font-bold">
            {data.financialHealth.der?.toFixed(2) ?? "N/A"}
          </p>
        </div>
        <div className="p-3 bg-card rounded-lg border text-center">
          <p className="text-xs text-muted-foreground">FCF Yield</p>
          <p className="text-lg font-bold">
            {data.cashFlow.fcfYield?.toFixed(1) ?? "N/A"}%
          </p>
        </div>
      </div>

      {/* Metric Groups */}
      {metricGroups.map((group) => (
        <MetricGroup
          key={group.title}
          title={group.title}
          icon={group.icon}
          description={group.description}
          collapsible={true}
        >
          <div className="divide-y">
            {group.metrics.map((metric, idx) => (
              <MetricRow key={idx} {...metric} />
            ))}
          </div>
        </MetricGroup>
      ))}

      {/* Export Actions */}
      <div className="flex flex-wrap gap-3 pt-4 border-t print:hidden">
        <button onClick={() => window.print()} className="btn btn-outline">
          🖨️ Print Metrics
        </button>
        <button
          onClick={() => {
            // Simple CSV export
            const csv = metricGroups
              .flatMap((g) =>
                g.metrics.map((m) => `${g.title},${m.label},${m.value}`),
              )
              .join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${data.symbol}-metrics.csv`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="btn btn-outline"
        >
          📊 Export CSV
        </button>
        <a href={`/stock/${data.symbol}`} className="btn btn-secondary">
          ← Back to Overview
        </a>
      </div>

      {/* Print Footer */}
      <footer className="hidden print:block mt-8 pt-4 border-t text-xs text-muted-foreground text-center">
        <p>
          {data.symbol} • Detailed Financial Metrics • Generated:{" "}
          {new Date().toLocaleDateString("id-ID")}
        </p>
        <p className="mt-1">
          Data sourced from company filings and market data providers. For
          informational purposes only.
        </p>
      </footer>
    </div>
  );
}
