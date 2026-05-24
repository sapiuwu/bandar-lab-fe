"use client";

import { useState } from "react";
import { ValuationInput, ValuationResult } from "@/types";
import { calculateDCF, calculateDDM, calculateBuffett } from "@/lib/utils";
import { NumberInput, ToggleInput } from "@/components/ui/FormInputs";

export function ValuationCalculator({
  currentPrice,
}: {
  currentPrice: number;
}) {
  const [activeTab, setActiveTab] = useState<"DCF" | "DDM" | "Buffett">("DCF");
  const [inputs, setInputs] = useState<ValuationInput>({
    // DCF defaults
    revenueGrowth: 0.1,
    operatingMargin: 0.15,
    taxRate: 0.25,
    capexPercent: 0.08,
    nwcPercent: 0.05,
    wacc: 0.12,
    terminalGrowth: 0.03,
    forecastYears: 5,
    // DDM defaults
    dividendPerShare: 0,
    dividendGrowth: 0.05,
    requiredReturn: 0.12,
    // Buffett defaults
    consistentEarnings: true,
    durableMoat: false,
    competentManagement: true,
    marginOfSafety: 0.25,
  });

  const [result, setResult] = useState<ValuationResult | null>(null);

  const handleCalculate = () => {
    let fairValue: number;
    let assumption: string;

    switch (activeTab) {
      case "DCF":
        fairValue = calculateDCF(inputs);
        assumption = `${inputs.forecastYears}y forecast, ${inputs.wacc * 100}% WACC`;
        break;
      case "DDM":
        fairValue = calculateDDM(inputs);
        assumption = `Div growth: ${inputs.dividendGrowth * 100}%, Req return: ${inputs.requiredReturn * 100}%`;
        break;
      case "Buffett":
        fairValue = calculateBuffett(inputs, currentPrice);
        assumption = `MoS: ${inputs.marginOfSafety * 100}%, Moat: ${inputs.durableMoat ? "Yes" : "No"}`;
        break;
      default:
        fairValue = 0;
        assumption = "";
    }

    setResult({
      method: activeTab,
      fairValue,
      upside: ((fairValue - currentPrice) / currentPrice) * 100,
      assumption,
    });
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b">
        {(["DCF", "DDM", "Buffett"] as const).map((method) => (
          <button
            key={method}
            onClick={() => setActiveTab(method)}
            className={`px-4 py-2 font-medium ${
              activeTab === method
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {method} Valuation
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeTab === "DCF" && (
          <>
            <NumberInput
              label="Revenue Growth (%)"
              value={inputs.revenueGrowth * 100}
              onChange={(v) => setInputs({ ...inputs, revenueGrowth: v / 100 })}
            />
            <NumberInput
              label="Operating Margin (%)"
              value={inputs.operatingMargin * 100}
              onChange={(v) =>
                setInputs({ ...inputs, operatingMargin: v / 100 })
              }
            />
            <NumberInput
              label="Tax Rate (%)"
              value={inputs.taxRate * 100}
              onChange={(v) => setInputs({ ...inputs, taxRate: v / 100 })}
            />
            <NumberInput
              label="WACC (%)"
              value={inputs.wacc * 100}
              onChange={(v) => setInputs({ ...inputs, wacc: v / 100 })}
            />
            <NumberInput
              label="Terminal Growth (%)"
              value={inputs.terminalGrowth * 100}
              onChange={(v) =>
                setInputs({ ...inputs, terminalGrowth: v / 100 })
              }
            />
            <NumberInput
              label="Forecast Years"
              value={inputs.forecastYears}
              onChange={(v) => setInputs({ ...inputs, forecastYears: v })}
              step={1}
              min={3}
              max={10}
            />
          </>
        )}

        {activeTab === "DDM" && (
          <>
            <NumberInput
              label="Dividend per Share"
              value={inputs.dividendPerShare}
              onChange={(v) => setInputs({ ...inputs, dividendPerShare: v })}
            />
            <NumberInput
              label="Dividend Growth (%)"
              value={inputs.dividendGrowth * 100}
              onChange={(v) =>
                setInputs({ ...inputs, dividendGrowth: v / 100 })
              }
            />
            <NumberInput
              label="Required Return (%)"
              value={inputs.requiredReturn * 100}
              onChange={(v) =>
                setInputs({ ...inputs, requiredReturn: v / 100 })
              }
            />
          </>
        )}

        {activeTab === "Buffett" && (
          <>
            <ToggleInput
              label="Consistent Earnings (10y+)"
              checked={inputs.consistentEarnings}
              onChange={(v) => setInputs({ ...inputs, consistentEarnings: v })}
            />
            <ToggleInput
              label="Durable Competitive Moat"
              checked={inputs.durableMoat}
              onChange={(v) => setInputs({ ...inputs, durableMoat: v })}
            />
            <ToggleInput
              label="Competent Management"
              checked={inputs.competentManagement}
              onChange={(v) => setInputs({ ...inputs, competentManagement: v })}
            />
            <NumberInput
              label="Margin of Safety (%)"
              value={inputs.marginOfSafety * 100}
              onChange={(v) =>
                setInputs({ ...inputs, marginOfSafety: v / 100 })
              }
              min={0}
              max={50}
            />
          </>
        )}
      </div>

      <button
        onClick={handleCalculate}
        className="btn btn-primary w-full md:w-auto"
      >
        Calculate Fair Value
      </button>

      {/* Result */}
      {result && (
        <div className="p-4 bg-card rounded-lg border">
          <h4 className="font-semibold mb-2">{result.method} Result</h4>
          <div className="text-3xl font-bold text-primary">
            {result.fairValue.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {result.assumption}
          </p>

          <div
            className={`mt-3 font-medium ${
              result.upside > 20
                ? "text-green-600"
                : result.upside > 0
                  ? "text-yellow-600"
                  : "text-red-600"
            }`}
          >
            {result.upside > 0 ? "▲" : "▼"} {Math.abs(result.upside).toFixed(1)}
            % vs current price
          </div>
        </div>
      )}
    </div>
  );
}
