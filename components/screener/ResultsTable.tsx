"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ScoreBadge } from "@/components/stock/ScoreBadge";
import { formatCompactCurrency } from "@/lib/utils";
import { allStocks } from "@/lib/mock-data";
import { Filters } from "./FilterPanel";
import { Pagination } from "@/components/ui/Pagination";

type SortKey = "symbol" | "price" | "sector" | "per" | "pbv" | "roe" | "score";

// ✅ Move SortIcon OUTSIDE the main component
interface SortIconProps {
  currentKey: SortKey;
  columnKey: SortKey;
  direction: "asc" | "desc";
}

function SortIcon({ currentKey, columnKey, direction }: SortIconProps) {
  if (currentKey !== columnKey)
    return <span className="text-xs ml-1 opacity-50">↕</span>;
  return (
    <span className="text-xs ml-1">{direction === "asc" ? "▲" : "▼"}</span>
  );
}

const getSortValue = (
  stock: (typeof allStocks)[0],
  key: SortKey,
): string | number | null => {
  switch (key) {
    case "symbol":
      return stock.basic.symbol;
    case "price":
      return stock.basic.price;
    case "sector":
      return stock.basic.sector;
    case "per":
      return stock.metrics.per;
    case "pbv":
      return stock.metrics.pbv;
    case "roe":
      return stock.metrics.roe;
    case "score":
      return stock.score.overall;
    default:
      return null;
  }
};

export function ResultsTable({ filters }: { filters: Filters }) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Sort state
  const [sortKey, setSortKey] = useState<SortKey>("symbol");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Reset to page 1 when filters/sort change
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  // Filter, sort, and paginate
  const { paginated, totalPages, totalItems } = useMemo(() => {
    // 1. Filter
    const filtered = allStocks.filter((stock) => {
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
    });

    // 2. Sort
    const sorted = [...filtered].sort((a, b) => {
      const valA = getSortValue(a, sortKey);
      const valB = getSortValue(b, sortKey);

      if (valA === null && valB === null) return 0;
      if (valA === null) return 1;
      if (valB === null) return -1;

      if (typeof valA === "string" && typeof valB === "string") {
        const cmp = valA.localeCompare(valB);
        return sortDir === "asc" ? cmp : -cmp;
      }
      if (typeof valA === "number" && typeof valB === "number") {
        return sortDir === "asc" ? valA - valB : valB - valA;
      }
      return 0;
    });

    // 3. Paginate
    const totalItems = sorted.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const safePage = Math.min(currentPage, totalPages || 1);
    const startIndex = (safePage - 1) * pageSize;
    const paginated = sorted.slice(startIndex, startIndex + pageSize);

    return { paginated, totalPages, totalItems };
  }, [filters, sortKey, sortDir, currentPage, pageSize]);

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th
                  className="px-4 py-3 cursor-pointer select-none"
                  onClick={() => handleSort("symbol")}
                >
                  Symbol{" "}
                  <SortIcon
                    currentKey={sortKey}
                    columnKey="symbol"
                    direction={sortDir}
                  />
                </th>
                <th
                  className="px-4 py-3 cursor-pointer select-none"
                  onClick={() => handleSort("price")}
                >
                  Price{" "}
                  <SortIcon
                    currentKey={sortKey}
                    columnKey="price"
                    direction={sortDir}
                  />
                </th>
                <th className="px-4 py-3 hidden md:table-cell">Sector</th>
                <th
                  className="px-4 py-3 hidden sm:table-cell cursor-pointer select-none"
                  onClick={() => handleSort("per")}
                >
                  PER{" "}
                  <SortIcon
                    currentKey={sortKey}
                    columnKey="per"
                    direction={sortDir}
                  />
                </th>
                <th className="px-4 py-3 hidden sm:table-cell">PBV</th>
                <th
                  className="px-4 py-3 hidden lg:table-cell cursor-pointer select-none"
                  onClick={() => handleSort("roe")}
                >
                  ROE{" "}
                  <SortIcon
                    currentKey={sortKey}
                    columnKey="roe"
                    direction={sortDir}
                  />
                </th>
                <th
                  className="px-4 py-3 text-center cursor-pointer select-none"
                  onClick={() => handleSort("score")}
                >
                  Score{" "}
                  <SortIcon
                    currentKey={sortKey}
                    columnKey="score"
                    direction={sortDir}
                  />
                </th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginated.map((stock) => (
                <tr
                  key={stock.basic.symbol}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 font-bold font-mono">
                    <Link
                      href={`/stock/${stock.basic.symbol}`}
                      className="hover:text-primary"
                    >
                      {stock.basic.symbol}
                    </Link>
                    <span className="block text-xs text-muted-foreground font-normal sm:hidden">
                      {stock.basic.sector}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {formatCompactCurrency(stock.basic.price, "IDR", 0)}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                    {stock.basic.sector}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {stock.metrics.per?.toFixed(2) ?? "-"}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {stock.metrics.pbv?.toFixed(2) ?? "-"}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {stock.metrics.roe !== null ? (
                      <span className="text-green-600">
                        {stock.metrics.roe.toFixed(1)}%
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ScoreBadge score={stock.score.overall} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Link
                      href={`/stock/${stock.basic.symbol}`}
                      className="text-primary hover:underline text-xs font-bold"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginated.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            🤷 No stocks match your filters. Try widening your search criteria.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          showPageSizeSelector={true}
        />
      )}
    </div>
  );
}
