"use client";

import { MetricCard } from "./MetricCard";
import { StockMetrics } from "@/types";

// ✅ Define explicit type for metric items
interface MetricItem {
  key: keyof StockMetrics;
  label: string;
  hint: string;
  suffix?: string;
  format?: "currency" | "percent" | "number" | "compact" | "compact-currency";
}

interface Props {
  metrics: StockMetrics;
  compact?: boolean;
}

export function MetricsGrid({ metrics, compact = false }: Props) {
  const metricGroups: { title: string; items: MetricItem[] }[] = [
    {
      title: "Valuation",
      items: [
        {
          key: "per",
          label: "P/E Ratio",
          hint: "Lower may indicate undervalued",
        },
        {
          key: "pbv",
          label: "P/BV Ratio",
          hint: "< 1 may signal undervaluation",
        },
        { key: "pcf", label: "P/CF Ratio", hint: "Cash flow based valuation" },
        { key: "peg", label: "PEG Ratio", hint: "P/E adjusted for growth" },
      ],
    },
    {
      title: "Profitability",
      items: [
        {
          key: "roe",
          label: "ROE",
          suffix: "%",
          hint: "Return on Equity",
          format: "percent",
        },
        {
          key: "roi",
          label: "ROI",
          suffix: "%",
          hint: "Return on Investment",
          format: "percent",
        },
        {
          key: "npm",
          label: "Net Margin",
          suffix: "%",
          hint: "Net Profit / Revenue",
          format: "percent",
        },
        {
          key: "gpm",
          label: "Gross Margin",
          suffix: "%",
          hint: "Gross Profit / Revenue",
          format: "percent",
        },
      ],
    },
    {
      title: "Financial Health",
      items: [
        { key: "der", label: "D/E Ratio", hint: "Debt to Equity" },
        { key: "cr", label: "Current Ratio", hint: "Liquidity measure" },
        {
          key: "quickRatio",
          label: "Quick Ratio",
          hint: "Acid-test liquidity",
        },
      ],
    },
    {
      title: "Market & Cash Flow",
      items: [
        {
          key: "freeFloat",
          label: "Free Float",
          suffix: "%",
          hint: "Publicly tradable shares",
          format: "percent",
        },
        {
          key: "fcfYield",
          label: "FCF Yield",
          suffix: "%",
          hint: "Free Cash Flow / Market Cap",
          format: "percent",
        },
        {
          key: "marketCap",
          label: "Market Cap",
          format: "compact-currency",
          hint: "Total market value",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {metricGroups.map((group) => (
        <div key={group.title}>
          <h3 className="text-lg font-semibold mb-3">{group.title}</h3>
          <div
            className={`grid gap-3 ${compact ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}`}
          >
            {group.items.map((item) => {
              const value = metrics[item.key];
              return (
                <MetricCard
                  key={item.key}
                  label={item.label}
                  value={value}
                  suffix={item.suffix}
                  format={item.format}
                  hint={item.hint}
                  compact={compact}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
