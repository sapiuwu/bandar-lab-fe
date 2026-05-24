"use client";

import { formatCompactCurrency } from "@/lib/utils";

interface ExecutiveSummaryProps {
  recommendation: string;
  overallScore: number;
  consensusFairValue: number;
  consensusUpside: number;
  currentPrice: number;
  currency: string;
  keyHighlights: string[];
  keyRisks: string[];
  valuationSummary: { method: string; fairValue: number; upside: number }[];
}

export function ExecutiveSummary({
  recommendation,
  overallScore,
  consensusFairValue,
  consensusUpside,
  currentPrice,
  currency,
  keyHighlights,
  keyRisks,
  valuationSummary,
}: ExecutiveSummaryProps) {
  return (
    <section className="space-y-6 print:break-inside-avoid">
      <h2 className="text-xl font-bold flex items-center gap-2">
        📋 Executive Summary
      </h2>

      {/* Recommendation Card */}
      <div className="p-5 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Our Recommendation</p>
            <p className="text-2xl font-bold">{recommendation}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Overall Score:{" "}
              <span className="font-semibold">{overallScore}/100</span>
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              Consensus Fair Value
            </p>
            <p className="text-2xl font-bold text-primary">
              {formatCompactCurrency(consensusFairValue, currency, 0)}
            </p>
            <p
              className={`text-sm font-medium ${consensusUpside >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {consensusUpside >= 0 ? "▲" : "▼"}{" "}
              {Math.abs(consensusUpside).toFixed(1)}% vs Current Price
            </p>
          </div>
        </div>
      </div>

      {/* Valuation Methods Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {valuationSummary.map((v) => (
          <div
            key={v.method}
            className="p-3 bg-card rounded-lg border text-center"
          >
            <p className="text-xs text-muted-foreground uppercase">
              {v.method}
            </p>
            <p className="text-lg font-bold">
              {formatCompactCurrency(v.fairValue, currency, 0)}
            </p>
            <p
              className={`text-xs font-medium ${v.upside >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {v.upside >= 0 ? "+" : ""}
              {v.upside.toFixed(1)}%
            </p>
          </div>
        ))}
      </div>

      {/* Key Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-3 text-green-700 dark:text-green-400">
            ✅ Key Highlights
          </h3>
          <ul className="space-y-2">
            {keyHighlights.map((highlight, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-red-700 dark:text-red-400">
            ⚠️ Key Risks
          </h3>
          <ul className="space-y-2">
            {keyRisks.map((risk, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-red-500 mt-0.5">⚠</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
