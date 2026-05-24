"use client";

import { Tooltip } from "@/components/ui/FormInputs";
import { formatCompactCurrency, formatCompactNumber } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: number | null;
  suffix?: string;
  format?: "currency" | "percent" | "number" | "compact" | "compact-currency";
  hint?: string;
  compact?: boolean;
}

export function MetricCard({
  label,
  value,
  suffix = "",
  format,
  hint,
  compact = false,
}: MetricCardProps) {
  const displayValue = () => {
    if (value === null || value === undefined || isNaN(value)) {
      return <span className="text-muted-foreground">N/A</span>;
    }

    switch (format) {
      case "currency":
        return value.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        });

      case "compact-currency":
        return formatCompactCurrency(value, "IDR", 1);

      case "compact":
        return formatCompactNumber(value, 1);

      case "percent":
        return `${value.toFixed(2)}%`;

      default:
        return `${formatCompactNumber(value, 2)}${suffix}`;
    }
  };

  return (
    <div
      className={`p-3 rounded-lg border bg-card ${compact ? "text-sm" : ""}`}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="text-muted-foreground font-medium">{label}</span>
        {hint && (
          <Tooltip content={hint}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground cursor-help hover:text-foreground transition-colors"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
          </Tooltip>
        )}
      </div>
      <div className={`font-bold ${compact ? "text-lg" : "text-xl"}`}>
        {displayValue()}
      </div>
    </div>
  );
}
