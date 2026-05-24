"use client";
import { ValuationResult } from "@/types";

interface ValuationSummaryProps {
  currentPrice: number;
  valuations: ValuationResult[];
  consensus: string;
}

export function ValuationSummary({
  currentPrice,
  valuations,
  consensus,
}: ValuationSummaryProps) {
  const consensusColor = consensus.includes("Buy")
    ? "bg-green-100 text-green-700 border-green-200"
    : consensus.includes("Hold")
      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
      : "bg-red-100 text-red-700 border-red-200";

  return (
    <div className="p-5 bg-card rounded-xl border space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Fair Value Estimation</h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border ${consensusColor}`}
        >
          {consensus}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-muted/40 rounded-lg text-center">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            Current Price
          </div>
          <div className="text-xl font-bold mt-1">
            {currentPrice.toLocaleString("id-ID")}
          </div>
        </div>

        {valuations.map((v) => (
          <div
            key={v.method}
            className="p-3 bg-muted/40 rounded-lg text-center"
          >
            <div className="text-xs text-muted-foreground uppercase tracking-wide">
              {v.method} Fair Value
            </div>
            <div
              className={`text-xl font-bold mt-1 ${v.upside >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {v.fairValue.toLocaleString("id-ID")}
            </div>
            <div
              className={`text-xs mt-1 font-medium ${v.upside >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {v.upside > 0 ? "▲" : "▼"} {Math.abs(v.upside).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground border-t pt-3 mt-2">
        ⚠️ Valuations are based on simplified models. Always verify assumptions
        and cross-reference with official financial reports before investing.
      </p>
    </div>
  );
}
