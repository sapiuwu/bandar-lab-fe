"use client";

import { useState } from "react";
import { NumberInput } from "@/components/ui/NumberInput";
import {
  calculateDCF,
  calculateDCFSensitivity,
  type DCFInputs,
} from "@/lib/valuation/dcf";
import { formatCompactCurrency } from "@/lib/utils";
import { ResultCard } from "./ResultCard";

interface DCFCalculatorProps {
  initialPrice?: number;
  initialInputs?: Partial<DCFInputs>;
}

export function DCFCalculator({
  initialPrice = 10000,
  initialInputs = {},
}: DCFCalculatorProps) {
  const [inputs, setInputs] = useState<DCFInputs>({
    revenue: 10_000_000_000_000, // Rp 10T
    operatingMargin: 15, // 15%
    taxRate: 25, // 25%
    revenueGrowth5y: 10, // 10% annual growth
    revenueGrowthTerminal: 3, // 3% terminal
    capexPercent: 8, // 8% of revenue
    nwcPercent: 5, // 5% of revenue
    wacc: 12, // 12% discount rate
    cash: 5_000_000_000_000, // Rp 5T cash
    debt: 3_000_000_000_000, // Rp 3T debt
    sharesOutstanding: 1_000_000_000, // 1B shares
    ...initialInputs,
  });

  const [result, setResult] = useState<ReturnType<typeof calculateDCF> | null>(
    null,
  );
  const [showSensitivity, setShowSensitivity] = useState(false);

  const handleCalculate = () => {
    try {
      const res = calculateDCF(inputs, initialPrice);
      if (showSensitivity) {
        res.sensitivity = calculateDCFSensitivity(inputs);
      }
      setResult(res);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Calculation error");
    }
  };

  const updateInput = <K extends keyof DCFInputs>(
    key: K,
    value: DCFInputs[K],
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-card rounded-xl border">
        <h3 className="font-semibold col-span-full mb-2">📊 Assumptions</h3>

        {/* Revenue & Margins */}
        <NumberInput
          label="Annual Revenue"
          value={inputs.revenue}
          onChange={(v) => updateInput("revenue", v)}
          prefix="Rp"
          step={1_000_000_000}
          hint="Latest full-year revenue"
        />
        <NumberInput
          label="Operating Margin"
          value={inputs.operatingMargin}
          onChange={(v) => updateInput("operatingMargin", v)}
          suffix="%"
          min={0}
          max={100}
          hint="EBIT / Revenue"
        />
        <NumberInput
          label="Tax Rate"
          value={inputs.taxRate}
          onChange={(v) => updateInput("taxRate", v)}
          suffix="%"
          min={0}
          max={50}
        />

        {/* Growth */}
        <NumberInput
          label="Revenue Growth (5y)"
          value={inputs.revenueGrowth5y}
          onChange={(v) => updateInput("revenueGrowth5y", v)}
          suffix="%"
          min={-50}
          max={100}
          hint="Expected annual growth next 5 years"
        />
        <NumberInput
          label="Terminal Growth"
          value={inputs.revenueGrowthTerminal}
          onChange={(v) => updateInput("revenueGrowthTerminal", v)}
          suffix="%"
          min={0}
          max={10}
          hint="Long-term perpetual growth rate"
        />

        {/* Investment */}
        <NumberInput
          label="Capex % of Revenue"
          value={inputs.capexPercent}
          onChange={(v) => updateInput("capexPercent", v)}
          suffix="%"
          min={0}
          max={50}
        />
        <NumberInput
          label="NWC Change % of Revenue"
          value={inputs.nwcPercent}
          onChange={(v) => updateInput("nwcPercent", v)}
          suffix="%"
          min={-20}
          max={20}
          hint="Working capital investment needs"
        />

        {/* Discount Rate */}
        <NumberInput
          label="WACC"
          value={inputs.wacc}
          onChange={(v) => updateInput("wacc", v)}
          suffix="%"
          min={5}
          max={30}
          step={0.5}
          hint="Weighted Average Cost of Capital"
        />

        {/* Balance Sheet */}
        <NumberInput
          label="Cash & Equivalents"
          value={inputs.cash}
          onChange={(v) => updateInput("cash", v)}
          prefix="Rp"
          step={1_000_000_000}
        />
        <NumberInput
          label="Total Debt"
          value={inputs.debt}
          onChange={(v) => updateInput("debt", v)}
          prefix="Rp"
          step={1_000_000_000}
        />
        <NumberInput
          label="Shares Outstanding"
          value={inputs.sharesOutstanding}
          onChange={(v) => updateInput("sharesOutstanding", v)}
          step={100_000_000}
          hint="Number of shares"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button onClick={handleCalculate} className="btn btn-primary">
          🧮 Calculate Fair Value
        </button>
        <button
          onClick={() => setShowSensitivity(!showSensitivity)}
          className="btn btn-outline"
        >
          {showSensitivity ? "Hide" : "Show"} Sensitivity
        </button>
        <button
          onClick={() =>
            setInputs({
              revenue: 10_000_000_000_000,
              operatingMargin: 15,
              taxRate: 25,
              revenueGrowth5y: 10,
              revenueGrowthTerminal: 3,
              capexPercent: 8,
              nwcPercent: 5,
              wacc: 12,
              cash: 5_000_000_000_000,
              debt: 3_000_000_000_000,
              sharesOutstanding: 1_000_000_000,
            })
          }
          className="btn btn-secondary"
        >
          ↺ Reset Defaults
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <ResultCard
            title="DCF Fair Value"
            value={formatCompactCurrency(result.fairValuePerShare, "IDR", 0)}
            upside={result.impliedUpside}
            currentPrice={initialPrice}
            assumptions={result.assumptions}
          />

          {/* Sensitivity Table */}
          {showSensitivity && result.sensitivity && (
            <div className="p-4 bg-card rounded-xl border">
              <h4 className="font-semibold mb-3">🎯 Sensitivity Analysis</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-muted-foreground">
                      <th className="p-2 text-left">WACC ↓ / Growth →</th>
                      {result.sensitivity.growth.map((g) => (
                        <th key={g} className="p-2 text-center">
                          {g}%
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.sensitivity.wacc.map((w, i) => (
                      <tr key={w} className="border-t">
                        <td className="p-2 font-medium">{w}%</td>
                        {result.sensitivity!.values[i].map((val, j) => (
                          <td key={j} className="p-2 text-center font-mono">
                            {formatCompactCurrency(val, "IDR", 0)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Fair value per share at different WACC and terminal growth
                combinations
              </p>
            </div>
          )}

          {/* Key Metrics Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-muted/40 rounded-lg">
              <div className="text-xs text-muted-foreground">
                Enterprise Value
              </div>
              <div className="font-bold">
                {formatCompactCurrency(result.enterpriseValue, "IDR")}
              </div>
            </div>
            <div className="p-3 bg-muted/40 rounded-lg">
              <div className="text-xs text-muted-foreground">Equity Value</div>
              <div className="font-bold">
                {formatCompactCurrency(result.equityValue, "IDR")}
              </div>
            </div>
            <div className="p-3 bg-muted/40 rounded-lg">
              <div className="text-xs text-muted-foreground">
                PV of FCFF (5y)
              </div>
              <div className="font-bold">
                {formatCompactCurrency(
                  result.enterpriseValue - (result.sensitivity ? 0 : 0),
                  "IDR",
                )}
              </div>
            </div>
            <div className="p-3 bg-muted/40 rounded-lg">
              <div className="text-xs text-muted-foreground">
                Implied Upside
              </div>
              <div
                className={`font-bold ${result.impliedUpside >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {result.impliedUpside >= 0 ? "+" : ""}
                {result.impliedUpside.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-800 dark:text-amber-200">
        ⚠️ <strong>Disclaimer:</strong> This DCF model is a simplified
        educational tool. Real valuation requires detailed financial analysis,
        industry research, and professional judgment. Past performance does not
        guarantee future results. Not financial advice.
      </div>
    </div>
  );
}
