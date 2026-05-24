"use client";

import { useState } from "react";
import { WatchlistTable } from "@/components/stock/WatchlistTable";
import { mockWatchlist } from "@/lib/mock-data";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"banking" | "industry">("banking");

  // Filter watchlist by sector (mock logic)
  const filteredWatchlist = mockWatchlist.filter((stock) =>
    activeTab === "banking"
      ? stock.sector === "Financials"
      : stock.sector !== "Financials",
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b pb-1">
        <button
          onClick={() => setActiveTab("banking")}
          className={`px-4 py-2 font-medium rounded-t-lg border-b-2 transition-colors ${
            activeTab === "banking"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          🏦 Banking (
          {mockWatchlist.filter((s) => s.sector === "Financials").length})
        </button>
        <button
          onClick={() => setActiveTab("industry")}
          className={`px-4 py-2 font-medium rounded-t-lg border-b-2 transition-colors ${
            activeTab === "industry"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          🏭 Other Industries (
          {mockWatchlist.filter((s) => s.sector !== "Financials").length})
        </button>
      </div>

      {/* Watchlist Table */}
      <WatchlistTable stocks={filteredWatchlist} />
    </div>
  );
}
