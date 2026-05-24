"use client";

import { formatCompactCurrency } from "@/lib/utils";

interface ValuationSectionProps {
  valuations: {
    method: string;
    fairValue: number;
    upside: number;
    assumptions: string[];
    verdict: string;
  }[];
  consensusFairValue: number;
  currentPrice: number;
  currency: string;
}

export function ValuationSection({
  valuations,
  consensusFairValue,
  currentPrice,
  currency,
}: ValuationSectionProps) {
  const getVerdictColor = (verdict: string) => {
    if (verdict === "Undervalued")
      return "text-green-600 bg-green-50 border-green-200";
    if (verdict === "Fair Value")
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getUpsideColor = (upside: number) => {
    if (upside >= 20) return "text-green-600 font-semibold";
    if (upside >= 0) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <section className="space-y-6 print:break-inside-avoid">
      <h2 className="text-xl font-bold flex items-center gap-2">
        💵 Valuation Analysis
      </h2>

      {/* Consensus Summary */}
      <div className="p-5 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl print:border-gray-300 print:bg-gray-50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Consensus Fair Value
            </p>
            <p className="text-3xl font-bold text-primary">
              {formatCompactCurrency(consensusFairValue, currency, 0)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">vs Current Price</p>
            <p
              className={`text-xl font-bold ${getUpsideColor(consensusFairValue - currentPrice)}`}
            >
              {((consensusFairValue - currentPrice) / currentPrice) * 100 >= 0
                ? "▲"
                : "▼"}{" "}
              {Math.abs(
                ((consensusFairValue - currentPrice) / currentPrice) * 100,
              ).toFixed(1)}
              %
            </p>
          </div>
        </div>
      </div>

      {/* Method Comparison */}
      <div className="space-y-4">
        <h3 className="font-semibold">Valuation Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {valuations.map((v) => (
            <div
              key={v.method}
              className="p-4 bg-card rounded-xl border hover:border-primary/50 transition-colors print:border-gray-300"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold">{v.method}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full border ${getVerdictColor(v.verdict)}`}
                >
                  {v.verdict}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-muted-foreground text-sm">
                    Fair Value
                  </span>
                  <span className="font-bold text-lg">
                    {formatCompactCurrency(v.fairValue, currency, 0)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-muted-foreground text-sm">Upside</span>
                  <span className={`font-medium ${getUpsideColor(v.upside)}`}>
                    {v.upside >= 0 ? "+" : ""}
                    {v.upside.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Assumptions Preview */}
              <details className="mt-3 group print:open">
                <summary className="text-xs text-muted-foreground cursor-pointer list-none flex items-center gap-1 print:hidden">
                  <span className="group-open:rotate-90 transition-transform">
                    ▶
                  </span>
                  Key Assumptions
                </summary>
                <ul className="mt-2 text-xs text-muted-foreground space-y-1 pl-4 border-l print:pl-0 print:border-l-0">
                  {v.assumptions.slice(0, 3).map((a, i) => (
                    <li key={i}>• {a}</li>
                  ))}
                  {v.assumptions.length > 3 && (
                    <li className="text-muted-foreground">
                      +{v.assumptions.length - 3} more...
                    </li>
                  )}
                </ul>
              </details>
            </div>
          ))}
        </div>
      </div>

      {/* Valuation Range Visualization */}
      <div className="p-4 bg-card rounded-xl border print:border-gray-300">
        <h3 className="font-semibold mb-4">Fair Value Range</h3>
        <div className="relative h-12 bg-muted rounded-lg overflow-hidden">
          {/* Price marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-foreground z-10"
            style={{
              left: `${Math.min(95, Math.max(5, ((currentPrice - Math.min(...valuations.map((v) => v.fairValue))) / (Math.max(...valuations.map((v) => v.fairValue)) - Math.min(...valuations.map((v) => v.fairValue)))) * 90 + 5))}%`,
            }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap">
              Current: {formatCompactCurrency(currentPrice, currency, 0)}
            </div>
          </div>

          {/* Fair value bars */}
          {valuations.map((v, i) => {
            const minVal = Math.min(...valuations.map((x) => x.fairValue));
            const maxVal = Math.max(...valuations.map((x) => x.fairValue));
            const range = maxVal - minVal || 1;
            const left = ((v.fairValue - minVal) / range) * 90 + 5;

            return (
              <div
                key={v.method}
                className={`absolute top-1/2 -translate-y-1/2 w-3 h-6 rounded-full border-2 ${
                  v.verdict === "Undervalued"
                    ? "bg-green-500 border-green-600"
                    : v.verdict === "Fair Value"
                      ? "bg-yellow-500 border-yellow-600"
                      : "bg-red-500 border-red-600"
                }`}
                style={{ left: `${left}%` }}
                title={`${v.method}: ${formatCompactCurrency(v.fairValue, currency, 0)}`}
              />
            );
          })}

          {/* Consensus marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full"
            style={{
              left: `${Math.min(95, Math.max(5, ((consensusFairValue - Math.min(...valuations.map((v) => v.fairValue))) / (Math.max(...valuations.map((v) => v.fairValue)) - Math.min(...valuations.map((v) => v.fairValue)))) * 90 + 5))}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2 print:hidden">
          <span>
            {formatCompactCurrency(
              Math.min(...valuations.map((v) => v.fairValue)),
              currency,
              0,
            )}
          </span>
          <span>Consensus</span>
          <span>
            {formatCompactCurrency(
              Math.max(...valuations.map((v) => v.fairValue)),
              currency,
              0,
            )}
          </span>
        </div>
      </div>
    </section>
  );
}
