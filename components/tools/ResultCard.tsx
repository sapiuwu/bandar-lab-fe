"use client";
import { formatCompactCurrency } from "@/lib/utils";

interface ResultCardProps {
  title: string;
  value: string;
  upside: number;
  currentPrice?: number;
  assumptions: string[];
  verdict?: string;
}

export function ResultCard({
  title,
  value,
  upside,
  currentPrice,
  assumptions,
  verdict,
}: ResultCardProps) {
  const upsideColor =
    upside >= 20
      ? "text-green-600"
      : upside >= 0
        ? "text-yellow-600"
        : "text-red-600";
  const badgeColor =
    upside >= 20
      ? "bg-green-100 text-green-700"
      : upside >= 0
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700";

  return (
    <div className="p-5 bg-card rounded-xl border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        {verdict && (
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`}
          >
            {verdict}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-4">
        <span className="text-3xl font-bold text-primary">{value}</span>
        {currentPrice && (
          <>
            <span className="text-muted-foreground">vs</span>
            <span className="text-lg text-muted-foreground">
              {formatCompactCurrency(currentPrice, "IDR", 0)}
            </span>
          </>
        )}
      </div>

      {currentPrice && (
        <div className={`font-medium ${upsideColor}`}>
          {upside >= 0 ? "▲" : "▼"} {Math.abs(upside).toFixed(1)}% implied{" "}
          {upside >= 0 ? "upside" : "downside"}
        </div>
      )}

      {/* Assumptions Summary */}
      <div className="pt-3 border-t">
        <h4 className="text-sm font-medium mb-2">Key Assumptions</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          {assumptions.slice(0, 3).map((a, i) => (
            <li key={i}>• {a}</li>
          ))}
          {assumptions.length > 3 && (
            <li className="text-xs">+{assumptions.length - 3} more...</li>
          )}
        </ul>
      </div>
    </div>
  );
}
