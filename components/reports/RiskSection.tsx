"use client";

interface RiskSectionProps {
  riskScore: number; // 0-100 (higher = safer)
  riskFactors: {
    category: string;
    level: "Low" | "Medium" | "High";
    description: string;
  }[];
  moat: {
    width: "Wide" | "Narrow" | "None";
    sources: string[];
    sustainability: "High" | "Medium" | "Low";
  };
}

function RiskLevelBadge({ level }: { level: "Low" | "Medium" | "High" }) {
  const colors = {
    Low: "bg-green-100 text-green-700 border-green-200",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    High: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full border font-medium ${colors[level]}`}
    >
      {level} Risk
    </span>
  );
}

function MoatIndicator({ width }: { width: "Wide" | "Narrow" | "None" }) {
  const config = {
    Wide: {
      icon: "🏰",
      color: "text-green-600",
      desc: "Strong competitive advantages",
    },
    Narrow: {
      icon: "🧱",
      color: "text-yellow-600",
      desc: "Some competitive advantages",
    },
    None: {
      icon: "🏚️",
      color: "text-red-600",
      desc: "Limited competitive advantages",
    },
  };
  const c = config[width];

  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl">{c.icon}</span>
      <div>
        <p className={`font-semibold ${c.color}`}>{width} Moat</p>
        <p className="text-xs text-muted-foreground">{c.desc}</p>
      </div>
    </div>
  );
}

export function RiskSection({
  riskScore,
  riskFactors,
  moat,
}: RiskSectionProps) {
  // Convert risk score to visual width (higher score = safer = more green)
  const safetyPercent = riskScore;
  const riskPercent = 100 - riskScore;

  return (
    <section className="space-y-6 print:break-inside-avoid">
      <h2 className="text-xl font-bold flex items-center gap-2">
        ⚠️ Risk & Moat Analysis
      </h2>

      {/* Overall Risk Score */}
      <div className="p-5 bg-card rounded-xl border print:border-gray-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Overall Risk Assessment</h3>
          <span
            className={`text-2xl font-bold ${
              riskScore >= 70
                ? "text-green-600"
                : riskScore >= 40
                  ? "text-yellow-600"
                  : "text-red-600"
            }`}
          >
            {riskScore}/100
          </span>
        </div>

        {/* Risk/Safety Bar */}
        <div className="relative h-6 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 bottom-0 bg-green-500 transition-all"
            style={{ width: `${safetyPercent}%` }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 bg-red-500 transition-all"
            style={{ width: `${riskPercent}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-foreground">
            {riskScore >= 70
              ? "Low Risk"
              : riskScore >= 40
                ? "Medium Risk"
                : "High Risk"}
          </div>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Safe ←</span>
          <span>→ Risky</span>
        </div>
      </div>

      {/* Risk Factors */}
      <div className="space-y-4">
        <h3 className="font-semibold">Risk Factors</h3>
        <div className="space-y-3">
          {riskFactors.map((factor, i) => (
            <div
              key={i}
              className="p-4 bg-card rounded-lg border flex items-start gap-3 print:border-gray-300"
            >
              <RiskLevelBadge level={factor.level} />
              <div className="flex-1">
                <p className="font-medium">{factor.category}</p>
                <p className="text-sm text-muted-foreground">
                  {factor.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Moat Analysis */}
      <div className="p-5 bg-card rounded-xl border print:border-gray-300">
        <h3 className="font-semibold mb-4">🏰 Competitive Moat</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Moat Width */}
          <div className="space-y-3">
            <MoatIndicator width={moat.width} />

            {moat.sources.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">
                  Sources of Advantage:
                </p>
                <ul className="space-y-1">
                  {moat.sources.map((source, i) => (
                    <li
                      key={i}
                      className="text-sm text-muted-foreground flex items-center gap-2"
                    >
                      <span className="text-green-500">✓</span> {source}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sustainability */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Moat Sustainability</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    moat.sustainability === "High"
                      ? "bg-green-500"
                      : moat.sustainability === "Medium"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{
                    width:
                      moat.sustainability === "High"
                        ? "100%"
                        : moat.sustainability === "Medium"
                          ? "60%"
                          : "30%",
                  }}
                />
              </div>
              <span
                className={`font-medium ${
                  moat.sustainability === "High"
                    ? "text-green-600"
                    : moat.sustainability === "Medium"
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {moat.sustainability}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Likelihood that competitive advantages persist over 5-10 years
            </p>
          </div>
        </div>
      </div>

      {/* Risk Mitigation Tips */}
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-800 dark:text-amber-200 print:bg-gray-100 print:border-gray-300 print:text-gray-800">
        <p className="font-medium mb-2">💡 Risk Management Tips</p>
        <ul className="space-y-1 text-sm">
          <li>• Consider position sizing based on risk score</li>
          <li>• Monitor key risk factors quarterly</li>
          <li>• Diversify across sectors to reduce concentration risk</li>
          <li>• Set stop-loss levels based on support/resistance analysis</li>
        </ul>
      </div>
    </section>
  );
}
