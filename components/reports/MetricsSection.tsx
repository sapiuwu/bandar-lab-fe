"use client";

import { formatCompactCurrency } from "@/lib/utils";

interface MetricsSectionProps {
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
}

// ✅ Define explicit type for metric items with optional format
interface MetricItem {
  key: string;
  label: string;
  value: number | null;
  hint: string;
  goodRange: [number, number];
  format?: "ratio" | "percent" | "currency";
}

interface MetricCardProps {
  label: string;
  value: number | null;
  format?: "ratio" | "percent" | "currency";
  hint?: string;
  goodRange?: [number, number];
}

function MetricCard({
  label,
  value,
  format = "ratio",
  hint,
  goodRange,
}: MetricCardProps) {
  const displayValue = () => {
    if (value === null || value === undefined || isNaN(value)) return "N/A";

    switch (format) {
      case "percent":
        return `${value.toFixed(1)}%`;
      case "currency":
        return formatCompactCurrency(value, "IDR", 0);
      default:
        return value.toFixed(2);
    }
  };

  // Determine color based on whether value is in "good" range
  const getValueColor = () => {
    if (value === null || !goodRange) return "text-foreground";
    const [min, max] = goodRange;
    if (value >= min && value <= max) return "text-green-600 font-semibold";
    if (value < min) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="p-3 bg-card rounded-lg border hover:border-primary/50 transition-colors print:border-gray-300">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        {hint && (
          <span className="group relative cursor-help" title={hint}>
            <span className="text-muted-foreground text-xs">ⓘ</span>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 w-40 print:hidden">
              {hint}
            </span>
          </span>
        )}
      </div>
      <span className={`text-lg font-bold ${getValueColor()}`}>
        {displayValue()}
      </span>
    </div>
  );
}

export function MetricsSection({
  valuation,
  profitability,
  financialHealth,
}: MetricsSectionProps) {
  // ✅ Define metric groups with explicit MetricItem type
  const metricGroups: { title: string; metrics: MetricItem[] }[] = [
    {
      title: "📈 Valuation Ratios",
      metrics: [
        {
          key: "per",
          label: "P/E Ratio",
          value: valuation.per,
          hint: "Price / Earnings. Lower may indicate undervaluation",
          goodRange: [5, 20],
        },
        {
          key: "pbv",
          label: "P/BV Ratio",
          value: valuation.pbv,
          hint: "Price / Book Value. <1 may signal undervaluation",
          goodRange: [0.5, 3],
        },
        {
          key: "pcf",
          label: "P/CF Ratio",
          value: valuation.pcf,
          hint: "Price / Cash Flow. Cash-based valuation",
          goodRange: [5, 15],
        },
        {
          key: "peg",
          label: "PEG Ratio",
          value: valuation.peg,
          hint: "P/E adjusted for growth. <1 may indicate value",
          goodRange: [0.5, 1.5],
        },
      ],
    },
    {
      title: "💰 Profitability",
      metrics: [
        {
          key: "roe",
          label: "ROE",
          value: profitability.roe,
          format: "percent",
          hint: "Return on Equity. >15% is strong",
          goodRange: [15, 100],
        },
        {
          key: "roi",
          label: "ROI",
          value: profitability.roi,
          format: "percent",
          hint: "Return on Investment",
          goodRange: [10, 100],
        },
        {
          key: "npm",
          label: "Net Margin",
          value: profitability.npm,
          format: "percent",
          hint: "Net Profit / Revenue. Higher is better",
          goodRange: [10, 100],
        },
      ],
    },
    {
      title: "🛡️ Financial Health",
      metrics: [
        {
          key: "der",
          label: "Debt/Equity",
          value: financialHealth.der,
          hint: "Lower is generally safer. <1 is conservative",
          goodRange: [0, 1],
        },
        {
          key: "cr",
          label: "Current Ratio",
          value: financialHealth.currentRatio,
          hint: "Current Assets / Liabilities. >1.5 is healthy",
          goodRange: [1.5, 3],
        },
      ],
    },
  ];

  return (
    <section className="space-y-6 print:break-inside-avoid">
      <h2 className="text-xl font-bold flex items-center gap-2">
        📊 Key Financial Metrics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricGroups.map((group) => (
          <div key={group.title} className="space-y-3">
            <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">
              {group.title}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {group.metrics.map((metric) => (
                <MetricCard
                  key={metric.key}
                  label={metric.label}
                  value={metric.value}
                  format={metric.format}
                  hint={metric.hint}
                  goodRange={metric.goodRange}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Metric Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground print:hidden">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-green-500"></span> In target
          range
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span> Below
          target
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-500"></span> Above target
        </span>
      </div>
    </section>
  );
}
