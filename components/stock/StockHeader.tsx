"use client";

interface StockHeaderProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export function StockHeader({
  symbol,
  name,
  price,
  change,
  changePercent,
}: StockHeaderProps) {
  const isPositive = change >= 0;
  return (
    <div className="p-5 bg-card rounded-xl border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold flex items-baseline gap-3">
          {symbol}
          <span className="text-base font-normal text-muted-foreground">
            {name}
          </span>
        </h1>
        <div className="flex items-baseline gap-3 mt-2">
          <span className="text-3xl font-bold tracking-tight">
            {price.toLocaleString("id-ID")}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-sm font-medium ${
              isPositive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isPositive ? "+" : ""}
            {change} ({isPositive ? "+" : ""}
            {changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="px-4 py-2 text-sm border rounded-lg hover:bg-muted transition-colors">
          ⭐ Watchlist
        </button>
        <button className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          📊 Compare
        </button>
      </div>
    </div>
  );
}
