"use client";

import { formatCompactCurrency, formatPercent } from "@/lib/utils";

export interface MetricRowProps {
  label: string;
  value: number | string | null | undefined;
  format?: "number" | "percent" | "currency" | "ratio" | "date";
  hint?: string;
  trend?: "up" | "down" | "neutral";
  benchmark?: {
    value: number;
    label: string;
  };
  status?: "good" | "warning" | "bad" | "neutral";
}

export function MetricRow({
  label,
  value,
  format = "number",
  hint,
  trend,
  benchmark,
  status = "neutral",
}: MetricRowProps) {
  const displayValue = () => {
    if (
      value === null ||
      value === undefined ||
      (typeof value === "number" && isNaN(value))
    ) {
      return <span className="text-muted-foreground">N/A</span>;
    }

    switch (format) {
      case "percent":
        return typeof value === "number" ? formatPercent(value, 2) : value;
      case "currency":
        return typeof value === "number"
          ? formatCompactCurrency(value, "IDR", 0)
          : value;
      case "ratio":
        return typeof value === "number" ? value.toFixed(2) : value;
      case "date":
        return typeof value === "string"
          ? new Date(value).toLocaleDateString("id-ID")
          : value;
      default:
        return typeof value === "number"
          ? value.toLocaleString("id-ID")
          : value;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "good":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "bad":
        return "text-red-600";
      default:
        return "text-foreground";
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    const icons = {
      up: <span className="text-green-500">▲</span>,
      down: <span className="text-red-500">▼</span>,
      neutral: <span className="text-muted-foreground">●</span>,
    };
    return icons[trend];
  };

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0 group">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm text-muted-foreground truncate">{label}</span>
        {hint && (
          <span
            className="group-hover:opacity-100 opacity-0 transition-opacity cursor-help"
            title={hint}
          >
            <span className="text-muted-foreground text-xs">ⓘ</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 text-right">
        {/* Trend indicator */}
        {getTrendIcon()}

        {/* Value */}
        <span className={`font-medium min-w-[80px] ${getStatusColor()}`}>
          {displayValue()}
        </span>

        {/* Benchmark comparison */}
        {benchmark && typeof value === "number" && (
          <span
            className={`text-xs ${
              value > benchmark.value
                ? "text-green-600"
                : value < benchmark.value
                  ? "text-red-600"
                  : "text-muted-foreground"
            }`}
          >
            vs {benchmark.label}: {benchmark.value}
            {format === "percent" ? "%" : ""}
          </span>
        )}
      </div>
    </div>
  );
}
