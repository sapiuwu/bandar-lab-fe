"use client";

import { useState, useMemo } from "react";
import { StockBasic, StockScore } from "@/types";
import { ScoreBadge } from "./ScoreBadge";
import { Pagination } from "@/components/ui/Pagination";

interface WatchlistItem extends StockBasic {
  score: StockScore;
  sector: string;
}

interface Props {
  stocks: WatchlistItem[];
}

type SortKey =
  | "symbol"
  | "name"
  | "sector"
  | "price"
  | "changePercent"
  | "score";

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

const getSortValue = (item: WatchlistItem, key: SortKey): string | number => {
  switch (key) {
    case "score":
      return item.score.overall;
    case "symbol":
      return item.symbol;
    case "name":
      return item.name;
    case "sector":
      return item.sector;
    case "price":
      return item.price;
    case "changePercent":
      return item.changePercent;
    default:
      return 0;
  }
};

export function WatchlistTable({ stocks }: Props) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sort state
  const [sortKey, setSortKey] = useState<SortKey>("symbol");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Filter state
  const [filterSector, setFilterSector] = useState<string>("all");

  // Reset to page 1 when filters/sort change
  const handleFilterChange = (sector: string) => {
    setFilterSector(sector);
    setCurrentPage(1);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  // Unique sectors for filter dropdown
  const sectors = useMemo(
    () => ["all", ...Array.from(new Set(stocks.map((s) => s.sector)))],
    [stocks],
  );

  // Filter, sort, and paginate
  const { paginated, totalPages, totalItems } = useMemo(() => {
    // 1. Filter
    const filtered = stocks.filter(
      (s) => filterSector === "all" || s.sector === filterSector,
    );

    // 2. Sort
    const sorted = [...filtered].sort((a, b) => {
      const aVal = getSortValue(a, sortKey);
      const bVal = getSortValue(b, sortKey);

      if (typeof aVal === "string" && typeof bVal === "string") {
        const cmp = aVal.localeCompare(bVal);
        return sortDir === "asc" ? cmp : -cmp;
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
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
  }, [stocks, filterSector, sortKey, sortDir, currentPage, pageSize]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={filterSector}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background text-sm"
        >
          {sectors.map((sector) => (
            <option key={sector} value={sector}>
              {sector === "all" ? "All Sectors" : sector}
            </option>
          ))}
        </select>

        <div className="text-sm text-muted-foreground">
          {totalItems} stocks found
        </div>
      </div>

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
                <th className="px-4 py-3">Name</th>
                <th
                  className="px-4 py-3 hidden md:table-cell cursor-pointer select-none"
                  onClick={() => handleSort("sector")}
                >
                  Sector{" "}
                  <SortIcon
                    currentKey={sortKey}
                    columnKey="sector"
                    direction={sortDir}
                  />
                </th>
                <th
                  className="px-4 py-3 hidden sm:table-cell text-right cursor-pointer select-none"
                  onClick={() => handleSort("price")}
                >
                  Price{" "}
                  <SortIcon
                    currentKey={sortKey}
                    columnKey="price"
                    direction={sortDir}
                  />
                </th>
                <th
                  className="px-4 py-3 hidden sm:table-cell text-right cursor-pointer select-none"
                  onClick={() => handleSort("changePercent")}
                >
                  Change{" "}
                  <SortIcon
                    currentKey={sortKey}
                    columnKey="changePercent"
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
                  key={stock.symbol}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 font-bold font-mono">
                    {stock.symbol}
                  </td>
                  <td className="px-4 py-3">{stock.name}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                    {stock.sector}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {stock.price.toLocaleString("id-ID")}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-medium ${
                      stock.changePercent >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stock.changePercent >= 0 ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ScoreBadge score={stock.score.overall} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <a
                      href={`/stock/${stock.symbol}`}
                      className="text-primary hover:underline text-xs font-bold"
                    >
                      View →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginated.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            🤷 No stocks match your filter. Try adjusting sector or clear
            filters.
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
