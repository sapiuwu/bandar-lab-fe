import { notFound } from "next/navigation";
import { StockHeader } from "@/components/stock/StockHeader";
import { MetricsGrid } from "@/components/stock/MetricsGrid";
import { ScoreGauge } from "@/components/stock/ScoreGauge";
import { ValuationCalculator } from "@/components/stock/ValuationCalculator";
import { findMockStock } from "@/lib/mock-data"; // ✅ Import helper
import Link from "next/link";

interface PageProps {
  params: Promise<{ symbol: string }>;
}

export default async function StockDetailPage({ params }: PageProps) {
  const { symbol } = await params;

  // ✅ Find stock from mock data (case-insensitive)
  const stock = findMockStock(symbol);

  if (!stock) {
    // Optional: Show helpful message for demo
    const availableSymbols = ["BBCA", "BBRI", "TLKM", "ASII", "UNVR"].join(
      ", ",
    );
    console.warn(
      `Stock "${symbol}" not found in mock data. Available: ${availableSymbols}`,
    );
    notFound();
  }

  return (
    <div className="p-6 space-y-6">
      <StockHeader
        symbol={stock.basic.symbol}
        name={stock.basic.name}
        price={stock.basic.price}
        change={stock.basic.change}
        changePercent={stock.basic.changePercent}
      />

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ScoreGauge score={stock.score.overall} label="Overall" />
        <ScoreGauge
          score={stock.score.valuation}
          label="Valuation"
          variant="warning"
        />
        <ScoreGauge
          score={stock.score.profitability}
          label="Profitability"
          variant="success"
        />
        <ScoreGauge score={stock.score.financialHealth} label="Health" />
      </div>

      {/* Metrics + Valuation in 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Key Metrics</h3>
          <MetricsGrid metrics={stock.metrics} />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Fair Value Calculator</h3>
          <ValuationCalculator currentPrice={stock.basic.price} />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-4 border-t">
        <Link href="/" className="btn btn-outline">
          ← Back to Dashboard
        </Link>
        <a
          href={`/stock/${stock.basic.symbol}/metrics`}
          className="btn btn-secondary"
        >
          📊 View All Metrics
        </a>
        <a
          href={`/stock/${stock.basic.symbol}/valuation`}
          className="btn btn-primary"
        >
          🧮 Run Valuation
        </a>
      </div>
    </div>
  );
}
