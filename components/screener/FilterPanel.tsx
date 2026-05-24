"use client";

export interface Filters {
  sector: string;
  minScore: number | null;
  minROE: number | null;
  maxPER: number | null;
  maxPBV: number | null;
}

interface FilterPanelProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  sectors: string[];
  totalResults: number;
}

export function FilterPanel({
  filters,
  onChange,
  sectors,
  totalResults,
}: FilterPanelProps) {
  return (
    <div className="p-4 bg-card rounded-xl border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">🔍 Filter Stocks</h3>
        <span className="text-xs bg-muted px-2 py-1 rounded-full">
          {totalResults} Found
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sector Select */}
        <div>
          <label className="text-xs text-muted-foreground block mb-1">
            Sector
          </label>
          <select
            value={filters.sector}
            onChange={(e) => onChange({ ...filters, sector: e.target.value })}
            className="w-full px-3 py-2 border rounded-md bg-background text-sm"
          >
            <option value="all">All Sectors</option>
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Score Min */}
        <div>
          <label className="text-xs text-muted-foreground block mb-1">
            Min Score
          </label>
          <input
            type="number"
            placeholder="Any"
            value={filters.minScore ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                minScore: e.target.value ? Number(e.target.value) : null,
              })
            }
            className="w-full px-3 py-2 border rounded-md bg-background text-sm"
          />
        </div>

        {/* ROE Min */}
        <div>
          <label className="text-xs text-muted-foreground block mb-1">
            Min ROE (%)
          </label>
          <input
            type="number"
            placeholder="Any"
            value={filters.minROE ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                minROE: e.target.value ? Number(e.target.value) : null,
              })
            }
            className="w-full px-3 py-2 border rounded-md bg-background text-sm"
          />
        </div>

        {/* Max PER */}
        <div>
          <label className="text-xs text-muted-foreground block mb-1">
            Max P/E Ratio
          </label>
          <input
            type="number"
            placeholder="Any"
            value={filters.maxPER ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                maxPER: e.target.value ? Number(e.target.value) : null,
              })
            }
            className="w-full px-3 py-2 border rounded-md bg-background text-sm"
          />
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() =>
          onChange({
            sector: "all",
            minScore: null,
            minROE: null,
            maxPER: null,
            maxPBV: null,
          })
        }
        className="text-xs text-primary hover:underline"
      >
        ✖ Reset Filters
      </button>
    </div>
  );
}
