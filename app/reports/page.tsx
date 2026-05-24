import Link from "next/link";
import { allStocks } from "@/lib/mock-data";

export default function ReportsDashboard() {
  // Mock: show recently viewed reports (in real app, fetch from user data)
  const recentReports = allStocks.slice(0, 5).map((stock) => ({
    symbol: stock.basic.symbol,
    name: stock.basic.name,
    sector: stock.basic.sector,
    lastViewed: new Date(
      Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    score: stock.score.overall,
  }));

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">📑 My Reports</h1>
        <p className="text-muted-foreground">
          Access your saved investment research reports.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/screener" className="btn btn-primary">
          ➕ Generate New Report
        </Link>
        <button className="btn btn-outline">📁 Import Report</button>
        <button className="btn btn-outline">⚙️ Report Settings</button>
      </div>

      {/* Recent Reports */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Recently Viewed</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentReports.map((report) => (
            <Link
              key={report.symbol}
              href={`/reports/${report.symbol}`}
              className="p-4 bg-card rounded-xl border hover:border-primary transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold font-mono group-hover:text-primary">
                    {report.symbol}
                  </p>
                  <p className="text-sm text-muted-foreground">{report.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {report.sector}
                  </p>
                </div>
                <span className="text-xs bg-muted px-2 py-1 rounded">
                  {new Date(report.lastViewed).toLocaleDateString("id-ID")}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm">
                  Score: <span className="font-bold">{report.score}/100</span>
                </span>
                <span className="text-primary text-sm group-hover:translate-x-1 transition-transform">
                  View →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Templates */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Report Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              name: "🎯 Quick Analysis",
              desc: "1-page summary for fast decisions",
              time: "~2 min",
            },
            {
              name: "📊 Deep Dive",
              desc: "Comprehensive valuation + risk assessment",
              time: "~10 min",
            },
            {
              name: "👥 Peer Comparison",
              desc: "Side-by-side analysis vs sector peers",
              time: "~5 min",
            },
          ].map((template) => (
            <button
              key={template.name}
              className="p-4 bg-card rounded-xl border hover:border-primary transition-colors text-left"
            >
              <p className="font-medium">{template.name}</p>
              <p className="text-sm text-muted-foreground">{template.desc}</p>
              <p className="text-xs text-muted-foreground mt-2">
                ⏱️ {template.time}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
