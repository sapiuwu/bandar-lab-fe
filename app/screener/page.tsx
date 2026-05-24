"use client";

import { useState, useMemo } from "react";
import { FilterPanel, Filters } from "@/components/screener/FilterPanel";
import { ResultsTable } from "@/components/screener/ResultsTable";
import { allStocks } from "@/lib/mock-data";

export default function ScreenerPage() {
  // Initialize filters
  const [filters, setFilters] = useState<Filters>({
    sector: "all",
    minScore: null,
    minROE: null,
    maxPER: null,
    maxPBV: null,
  });

  // ✅ Fix: Extract sectors from stock.basic.sector (not stock.sector)
  const sectors = useMemo(
    () => Array.from(new Set(allStocks.map((s) => s.basic.sector))).sort(),
    [],
  );

  // ✅ Optional: Calculate filtered count for accurate "X Found" display
  const filteredCount = useMemo(() => {
    return allStocks.filter((stock) => {
      if (filters.sector !== "all" && stock.basic.sector !== filters.sector)
        return false;
      if (filters.minScore !== null && stock.score.overall < filters.minScore)
        return false;
      if (
        filters.minROE !== null &&
        (stock.metrics.roe === null || stock.metrics.roe < filters.minROE)
      )
        return false;
      if (
        filters.maxPER !== null &&
        (stock.metrics.per === null || stock.metrics.per > filters.maxPER)
      )
        return false;
      if (
        filters.maxPBV !== null &&
        (stock.metrics.pbv === null || stock.metrics.pbv > filters.maxPBV)
      )
        return false;
      return true;
    }).length;
  }, [filters]);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">📊 Stock Screener</h1>
        <p className="text-muted-foreground">
          Find the best investment opportunities based on your criteria.
        </p>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        onChange={setFilters}
        sectors={sectors}
        totalResults={filteredCount} // ✅ Now shows accurate count
      />

      {/* Results Table */}
      <ResultsTable filters={filters} />
    </div>
  );
}
