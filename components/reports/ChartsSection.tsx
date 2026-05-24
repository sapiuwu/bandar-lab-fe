"use client";

import { useMemo } from "react";
import { formatCompactCurrency } from "@/lib/utils";

interface ChartsSectionProps {
  priceHistory: { date: string; price: number }[];
  currentPrice: number;
  fairValue: number;
  support: number;
  resistance: number;
}

// Simple SVG line chart component (no external deps)
function SimpleLineChart({
  data,
  height = 200,
  showFairValue = false,
  fairValue,
  showSupportResistance = false,
  support,
  resistance,
  currency = "IDR",
}: {
  data: { date: string; price: number }[];
  height?: number;
  showFairValue?: boolean;
  fairValue?: number;
  showSupportResistance?: boolean;
  support?: number;
  resistance?: number;
  currency?: string;
}) {
  if (data.length < 2)
    return (
      <div className="h-48 flex items-center justify-center text-muted-foreground">
        Insufficient data
      </div>
    );

  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices) * 0.95;
  const maxPrice = Math.max(...prices) * 1.05;
  const priceRange = maxPrice - minPrice || 1;

  // Calculate path points
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((d.price - minPrice) / priceRange) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  // Y-axis labels
  const yLabels = [minPrice, (minPrice + maxPrice) / 2, maxPrice];

  return (
    <div className="relative" style={{ height }}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            className="stroke-muted"
            strokeWidth="0.2"
          />
        ))}

        {/* Support/Resistance lines */}
        {showSupportResistance && support && (
          <line
            x1="0"
            y1={100 - ((support - minPrice) / priceRange) * 100}
            x2="100"
            y2={100 - ((support - minPrice) / priceRange) * 100}
            className="stroke-green-500"
            strokeWidth="0.3"
            strokeDasharray="2,2"
          />
        )}
        {showSupportResistance && resistance && (
          <line
            x1="0"
            y1={100 - ((resistance - minPrice) / priceRange) * 100}
            x2="100"
            y2={100 - ((resistance - minPrice) / priceRange) * 100}
            className="stroke-red-500"
            strokeWidth="0.3"
            strokeDasharray="2,2"
          />
        )}

        {/* Fair value line */}
        {showFairValue && fairValue && (
          <line
            x1="0"
            y1={100 - ((fairValue - minPrice) / priceRange) * 100}
            x2="100"
            y2={100 - ((fairValue - minPrice) / priceRange) * 100}
            className="stroke-primary"
            strokeWidth="0.5"
            strokeDasharray="3,2"
          />
        )}

        {/* Price line */}
        <polyline
          points={points}
          className="stroke-primary fill-none"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Area under line */}
        <polygon
          points={`0,100 ${points} 100,100`}
          className="fill-primary/10"
        />
      </svg>

      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground pr-1 print:hidden">
        {yLabels.map((val, i) => (
          <span key={i}>{formatCompactCurrency(val, currency, 0)}</span>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute top-2 right-2 flex flex-col gap-1 text-xs print:hidden">
        {showFairValue && fairValue && (
          <span className="flex items-center gap-1">
            <span
              className="w-4 h-0.5 bg-primary"
              style={{ borderTop: "2px dashed" }}
            ></span>
            Fair Value
          </span>
        )}
        {showSupportResistance && (
          <>
            <span className="flex items-center gap-1">
              <span
                className="w-4 h-0.5 bg-green-500"
                style={{ borderTop: "2px dashed" }}
              ></span>
              Support
            </span>
            <span className="flex items-center gap-1">
              <span
                className="w-4 h-0.5 bg-red-500"
                style={{ borderTop: "2px dashed" }}
              ></span>
              Resistance
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export function ChartsSection({
  priceHistory,
  currentPrice,
  fairValue,
  support,
  resistance,
}: ChartsSectionProps) {
  // Calculate simple moving average (7-day) for trend line
  const sma7 = useMemo(() => {
    if (priceHistory.length < 7) return null;
    return priceHistory
      .map((_, i) => {
        if (i < 6) return null;
        const slice = priceHistory.slice(i - 6, i + 1);
        const avg = slice.reduce((sum, d) => sum + d.price, 0) / 7;
        return { date: priceHistory[i].date, price: avg };
      })
      .filter((d): d is { date: string; price: number } => d !== null);
  }, [priceHistory]);

  // Determine trend direction
  const recentPrices = priceHistory.slice(-7);
  const trend =
    recentPrices.length >= 2
      ? recentPrices[recentPrices.length - 1].price > recentPrices[0].price
        ? "Bullish"
        : "Bearish"
      : "Neutral";

  return (
    <section className="space-y-6 print:break-inside-avoid">
      <h2 className="text-xl font-bold flex items-center gap-2">
        📈 Price Analysis
      </h2>

      {/* Main Price Chart */}
      <div className="p-4 bg-card rounded-xl border print:border-gray-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">30-Day Price History</h3>
          <span
            className={`text-sm font-medium px-2 py-1 rounded ${
              trend === "Bullish"
                ? "bg-green-100 text-green-700"
                : trend === "Bearish"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {trend} Trend
          </span>
        </div>

        <SimpleLineChart
          data={priceHistory}
          height={250}
          showFairValue={true}
          fairValue={fairValue}
          showSupportResistance={true}
          support={support}
          resistance={resistance}
        />

        {/* Chart footer */}
        <div className="flex flex-wrap justify-between items-center gap-2 mt-4 text-xs text-muted-foreground">
          <span>
            Period: {priceHistory[0]?.date} to{" "}
            {priceHistory[priceHistory.length - 1]?.date}
          </span>
          <span className="flex items-center gap-4 print:hidden">
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-primary"></span> Price
            </span>
            {sma7 && (
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-primary/50"></span> 7-day SMA
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Key Levels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-card rounded-xl border text-center print:border-gray-300">
          <p className="text-xs text-muted-foreground uppercase">Support</p>
          <p className="text-xl font-bold text-green-600">
            {formatCompactCurrency(support, "IDR", 0)}
          </p>
          <p className="text-xs text-muted-foreground">
            {(((currentPrice - support) / currentPrice) * 100).toFixed(1)}%
            below current
          </p>
        </div>

        <div className="p-4 bg-card rounded-xl border text-center print:border-gray-300">
          <p className="text-xs text-muted-foreground uppercase">
            Current Price
          </p>
          <p className="text-xl font-bold">
            {formatCompactCurrency(currentPrice, "IDR", 0)}
          </p>
          <p className="text-xs text-muted-foreground">
            As of report generation
          </p>
        </div>

        <div className="p-4 bg-card rounded-xl border text-center print:border-gray-300">
          <p className="text-xs text-muted-foreground uppercase">Resistance</p>
          <p className="text-xl font-bold text-red-600">
            {formatCompactCurrency(resistance, "IDR", 0)}
          </p>
          <p className="text-xs text-muted-foreground">
            {(((resistance - currentPrice) / currentPrice) * 100).toFixed(1)}%
            above current
          </p>
        </div>
      </div>

      {/* Valuation Bands */}
      <div className="p-4 bg-card rounded-xl border print:border-gray-300">
        <h3 className="font-semibold mb-4">Valuation Bands</h3>
        <div className="relative h-16 bg-muted rounded-lg overflow-hidden">
          {/* Undervalued zone */}
          <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-green-100/50 flex items-center justify-center text-xs text-green-700 font-medium print:bg-gray-200">
            Undervalued
          </div>
          {/* Fair value zone */}
          <div className="absolute left-1/3 top-0 bottom-0 w-1/3 bg-yellow-100/50 flex items-center justify-center text-xs text-yellow-700 font-medium print:bg-gray-300">
            Fair Value ±10%
          </div>
          {/* Overvalued zone */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-red-100/50 flex items-center justify-center text-xs text-red-700 font-medium print:bg-gray-400">
            Overvalued
          </div>

          {/* Current price marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-1 h-12 bg-foreground rounded-full"
            style={{
              left: `${Math.min(95, Math.max(5, ((currentPrice - fairValue * 0.7) / (fairValue * 0.6)) * 100))}%`,
            }}
          >
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap bg-foreground text-background px-2 py-0.5 rounded print:hidden">
              Current
            </div>
          </div>

          {/* Fair value marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-0.5 h-16 bg-primary"
            style={{ left: "50%" }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2 print:hidden">
          <span>{formatCompactCurrency(fairValue * 0.7, "IDR", 0)}</span>
          <span>Fair Value: {formatCompactCurrency(fairValue, "IDR", 0)}</span>
          <span>{formatCompactCurrency(fairValue * 1.3, "IDR", 0)}</span>
        </div>
      </div>

      {/* Chart Notes */}
      <div className="p-4 bg-muted/30 rounded-lg text-xs text-muted-foreground print:bg-gray-100">
        <p className="font-medium mb-1">📊 Chart Notes:</p>
        <ul className="space-y-1">
          <li>• Price history shows last 30 trading days</li>
          <li>• Support/Resistance based on recent swing points</li>
          <li>
            • Fair value line represents consensus DCF/DDM/Buffett estimate
          </li>
          <li>
            • Valuation bands: &lt;70% FV = Undervalued, 70-130% = Fair,
            &gt;130% = Overvalued
          </li>
        </ul>
      </div>
    </section>
  );
}
