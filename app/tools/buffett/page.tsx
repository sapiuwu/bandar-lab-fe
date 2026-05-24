"use client";

import { useState } from "react";
import { NumberInput } from "@/components/ui/NumberInput";
import { calculateBuffett, type BuffettInputs } from "@/lib/valuation/buffett";
import { formatCompactCurrency } from "@/lib/utils";
import { ResultCard } from "@/components/tools/ResultCard";

export default function BuffettPage() {
  const [inputs, setInputs] = useState<BuffettInputs>({
    netIncome: 25_000_000_000_000, // Rp 25T
    depreciation: 3_000_000_000_000, // Rp 3T
    capex: 4_000_000_000_000, // Rp 4T
    workingCapitalChange: 1_000_000_000_000,
    earningsGrowth10y: 12, // 12% historical growth
    moatScore: 8, // 8/10 competitive advantage
    managementScore: 9, // 9/10 management quality
    marginOfSafety: 25, // 25% margin of safety
    requiredReturn: 15, // 15% hurdle rate
  });

  const [result, setResult] = useState<ReturnType<
    typeof calculateBuffett
  > | null>(null);
  const [currentPrice, setCurrentPrice] = useState(10000);

  const handleCalculate = () => {
    try {
      const res = calculateBuffett(inputs, currentPrice);
      setResult(res);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Calculation error");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">🎯 Buffett-Style Valuation</h2>
        <p className="text-muted-foreground">
          Estimate intrinsic value using owner earnings, competitive moats, and
          margin of safety.
        </p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-card rounded-xl border">
        <h3 className="font-semibold col-span-full mb-1">💵 Owner Earnings</h3>
        <NumberInput
          label="Net Income"
          value={inputs.netIncome}
          onChange={(v) => setInputs({ ...inputs, netIncome: v })}
          prefix="Rp"
          step={1_000_000_000_000}
        />
        <NumberInput
          label="+ Depreciation"
          value={inputs.depreciation}
          onChange={(v) => setInputs({ ...inputs, depreciation: v })}
          prefix="Rp"
          step={500_000_000_000}
          hint="Add back non-cash charges"
        />
        <NumberInput
          label="- Capex"
          value={inputs.capex}
          onChange={(v) => setInputs({ ...inputs, capex: v })}
          prefix="Rp"
          step={500_000_000_000}
          hint="Maintenance capital expenditures"
        />
        <NumberInput
          label="- Δ Working Capital"
          value={inputs.workingCapitalChange}
          onChange={(v) => setInputs({ ...inputs, workingCapitalChange: v })}
          prefix="Rp"
          step={500_000_000_000}
          hint="Changes in receivables, inventory, payables"
        />

        <h3 className="font-semibold col-span-full mb-1 mt-2">
          🏆 Quality Factors
        </h3>
        <NumberInput
          label="10y Earnings Growth"
          value={inputs.earningsGrowth10y}
          onChange={(v) => setInputs({ ...inputs, earningsGrowth10y: v })}
          suffix="%"
          min={-20}
          max={50}
        />
        <NumberInput
          label="Moat Score (1-10)"
          value={inputs.moatScore}
          onChange={(v) => setInputs({ ...inputs, moatScore: v })}
          min={1}
          max={10}
          step={1}
          hint="Brand, network effects, cost advantages"
        />
        <NumberInput
          label="Management Score (1-10)"
          value={inputs.managementScore}
          onChange={(v) => setInputs({ ...inputs, managementScore: v })}
          min={1}
          max={10}
          step={1}
          hint="Capital allocation, integrity, track record"
        />

        <h3 className="font-semibold col-span-full mb-1 mt-2">
          ⚙️ Buffett Parameters
        </h3>
        <NumberInput
          label="Margin of Safety"
          value={inputs.marginOfSafety}
          onChange={(v) => setInputs({ ...inputs, marginOfSafety: v })}
          suffix="%"
          min={10}
          max={50}
          step={5}
          hint="Buffer for estimation errors"
        />
        <NumberInput
          label="Required Return"
          value={inputs.requiredReturn}
          onChange={(v) => setInputs({ ...inputs, requiredReturn: v })}
          suffix="%"
          min={10}
          max={25}
          step={1}
          hint="Buffett's typical hurdle: 15%"
        />
        <NumberInput
          label="Current Price (for comparison)"
          value={currentPrice}
          onChange={setCurrentPrice}
          prefix="Rp"
          step={100}
        />
      </div>

      <button onClick={handleCalculate} className="btn btn-primary">
        🧮 Calculate Intrinsic Value
      </button>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <ResultCard
            title="Buffett Fair Value"
            value={formatCompactCurrency(
              result.fairValueWithMoS / 1_000_000_000,
              "IDR",
              0,
            )}
            upside={result.impliedUpside}
            currentPrice={currentPrice}
            assumptions={result.assumptions}
            verdict={result.buffettVerdict}
          />

          {/* Quality Score Visualization */}
          <div className="p-4 bg-card rounded-xl border">
            <h4 className="font-semibold mb-3">🏆 Qualitative Score</h4>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    result.qualitativeScore >= 70
                      ? "bg-green-500"
                      : result.qualitativeScore >= 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${result.qualitativeScore}%` }}
                />
              </div>
              <span className="font-bold text-lg">
                {result.qualitativeScore}/100
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Composite score based on owner earnings, growth, moat, and
              management quality
            </p>
          </div>
        </div>
      )}

      {/* Buffett Principles */}
      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-800 dark:text-green-200">
        🎯 <strong>Buffett Key Principles:</strong>
        (1) Buy wonderful businesses at fair prices, (2) Focus on owner
        earnings, not accounting earnings, (3) Demand a margin of safety, (4)
        Invest in what you understand, (5) Be fearful when others are greedy.
      </div>
    </div>
  );
}
