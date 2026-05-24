import { notFound } from "next/navigation";
import { generateReport } from "@/lib/reports/generateReport";
import { ReportHeader } from "@/components/reports/ReportHeader";
import { ExecutiveSummary } from "@/components/reports/ExecutiveSummary";
import { MetricsSection } from "@/components/reports/MetricsSection";
import { ValuationSection } from "@/components/reports/ValuationSection";
import { RiskSection } from "@/components/reports/RiskSection";
import { ChartsSection } from "@/components/reports/ChartsSection";
import { DisclaimerSection } from "@/components/reports/DisclaimerSection";
import { formatCompactCurrency } from "@/lib/utils";

interface PageProps {
  params: Promise<{ symbol: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ReportPage({ params, searchParams }: PageProps) {
  const { symbol } = await params;
  const search = await searchParams;

  const priceOverride = search?.price ? Number(search.price) : undefined;
  const report = generateReport(symbol.toUpperCase(), priceOverride);

  if (!report) {
    notFound();
  }

  // ✅ Compute all dynamic values BEFORE return (pure server-side)
  const generatedAt = new Date();
  const reportId = `${report.symbol}-${generatedAt.getTime().toString(36).toUpperCase()}`;
  const formattedDate = generatedAt.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const isoTimestamp = generatedAt.toISOString();

  return (
    <article className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 print:p-0 print:max-w-none">
      {/* Header - Client Component handles its own interactivity */}
      <ReportHeader
        symbol={report.symbol}
        name={report.name}
        sector={report.sector}
        currentPrice={report.currentPrice}
        currency={report.currency}
        recommendation={report.recommendation}
        overallScore={report.overallScore}
        consensusUpside={report.consensusUpside}
        reportId={reportId} // Optional: for CSV export
      />

      {/* Report Content - Print Friendly */}
      <div className="space-y-8 print:space-y-6">
        {/* Print Header (only visible when printing) */}
        <div className="hidden print:block border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold">
            {report.symbol} • Investment Research Report
          </h1>
          <p className="text-muted-foreground">
            {report.name} • {report.sector}
          </p>
          <p className="text-sm text-muted-foreground">
            Generated: {formattedDate} • Price:{" "}
            {formatCompactCurrency(report.currentPrice, report.currency, 0)}
          </p>
        </div>

        <ExecutiveSummary
          recommendation={report.recommendation}
          overallScore={report.overallScore}
          consensusFairValue={report.consensusFairValue}
          consensusUpside={report.consensusUpside}
          currentPrice={report.currentPrice}
          currency={report.currency}
          keyHighlights={report.keyHighlights}
          keyRisks={report.keyRisks}
          valuationSummary={report.valuations.map((v) => ({
            method: v.method,
            fairValue: v.fairValue,
            upside: v.upside,
          }))}
        />

        <MetricsSection
          valuation={report.valuation}
          profitability={report.profitability}
          financialHealth={report.financialHealth}
        />

        <ValuationSection
          valuations={report.valuations}
          consensusFairValue={report.consensusFairValue}
          currentPrice={report.currentPrice}
          currency={report.currency}
        />

        <ChartsSection
          priceHistory={report.priceHistory}
          currentPrice={report.currentPrice}
          fairValue={report.consensusFairValue}
          support={report.technicals.support}
          resistance={report.technicals.resistance}
        />

        <RiskSection
          riskScore={report.riskScore}
          riskFactors={report.riskFactors}
          moat={report.moat}
        />

        {/* Peer Comparison */}
        {report.peers.length > 0 && (
          <section className="space-y-4 print:break-inside-avoid">
            <h2 className="text-xl font-bold">👥 Peer Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground border-b">
                    <th className="p-3 text-left">Company</th>
                    <th className="p-3 text-right">P/E</th>
                    <th className="p-3 text-right">P/BV</th>
                    <th className="p-3 text-right">ROE</th>
                    <th className="p-3 text-right">Upside</th>
                  </tr>
                </thead>
                <tbody>
                  {report.peers.map((peer) => (
                    <tr key={peer.symbol} className="border-b last:border-0">
                      <td className="p-3 font-medium">{peer.symbol}</td>
                      <td className="p-3 text-right">
                        {peer.per?.toFixed(1) ?? "-"}
                      </td>
                      <td className="p-3 text-right">
                        {peer.pbv?.toFixed(2) ?? "-"}
                      </td>
                      <td className="p-3 text-right">
                        {peer.roe?.toFixed(1) ?? "-"}
                      </td>
                      <td
                        className={`p-3 text-right font-medium ${peer.upside >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {peer.upside >= 0 ? "+" : ""}
                        {peer.upside.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <DisclaimerSection />
      </div>

      {/* Print Footer */}
      <footer className="hidden print:block mt-8 pt-4 border-t text-xs text-muted-foreground text-center">
        <p>
          © {generatedAt.getFullYear()} StockAnalyzer • This report is for
          informational purposes only and does not constitute financial advice.
        </p>
        <p className="mt-1">
          Report ID: {reportId} • Generated: {isoTimestamp}
        </p>
      </footer>
    </article>
  );
}
