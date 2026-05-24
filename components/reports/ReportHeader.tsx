"use client";

import { useState } from "react";
import { formatCompactCurrency } from "@/lib/utils";
import { ScoreBadge } from "@/components/stock/ScoreBadge";
import { ExportMenu } from "./ExportMenu";

interface ReportHeaderProps {
  symbol: string;
  name: string;
  sector: string;
  currentPrice: number;
  currency: string;
  recommendation: string;
  overallScore: number;
  consensusUpside: number;
  reportId?: string; // Optional: for tracking exports
}

export function ReportHeader({
  symbol,
  name,
  sector,
  currentPrice,
  currency,
  recommendation,
  overallScore,
  consensusUpside,
  reportId,
}: ReportHeaderProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  // ✅ Internal handler: Print
  const handlePrint = () => {
    setIsPrinting(true);
    window.print();
    setTimeout(() => setIsPrinting(false), 1000);
  };

  // ✅ Internal handler: Share
  const handleShare = async () => {
    const url = `${window.location.origin}/reports/${symbol}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${symbol} Investment Report`,
          text: `Research report for ${name}`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Report link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  // ✅ Internal handler: Export CSV
  const handleExportCSV = () => {
    const csv = [
      ["Metric", "Value"],
      ["Symbol", symbol],
      ["Name", name],
      ["Sector", sector],
      ["Current Price", currentPrice],
      ["Currency", currency],
      ["Recommendation", recommendation],
      ["Overall Score", overallScore],
      ["Consensus Upside", `${consensusUpside.toFixed(2)}%`],
      ["Report ID", reportId || "N/A"],
      ["Generated", new Date().toISOString()],
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${symbol}-report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const recColor = recommendation.includes("Buy")
    ? "bg-green-100 text-green-700 border-green-200"
    : recommendation.includes("Hold")
      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
      : "bg-red-100 text-red-700 border-red-200";

  return (
    <header className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 pb-6 border-b print:hidden">
      {/* Stock Info */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{symbol}</h1>
          <ScoreBadge score={overallScore} size="md" />
        </div>
        <p className="text-lg text-muted-foreground">{name}</p>
        <p className="text-sm text-muted-foreground">{sector}</p>

        <div className="flex items-baseline gap-4 mt-3">
          <span className="text-3xl font-bold">
            {formatCompactCurrency(currentPrice, currency, 0)}
          </span>
          <span
            className={`px-2 py-1 rounded text-sm font-medium ${
              consensusUpside >= 0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {consensusUpside >= 0 ? "▲" : "▼"}{" "}
            {Math.abs(consensusUpside).toFixed(1)}% vs Fair Value
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`px-3 py-1.5 rounded-full text-sm font-bold border ${recColor}`}
        >
          {recommendation}
        </span>

        {/* ExportMenu now calls internal handlers */}
        <ExportMenu
          onExportCSV={handleExportCSV}
          onExportPDF={handlePrint} // PDF = print to PDF
        />

        <button
          onClick={handleShare}
          className="btn btn-outline"
          title="Share report"
        >
          🔗 Share
        </button>

        <button
          onClick={handlePrint}
          className="btn btn-outline"
          disabled={isPrinting}
          title="Print report"
        >
          {isPrinting ? "🖨️ Preparing..." : "🖨️ Print"}
        </button>
      </div>
    </header>
  );
}
