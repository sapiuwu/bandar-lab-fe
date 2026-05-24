"use client";

import { useState } from "react";
import { NumberInput } from "@/components/ui/NumberInput";
import { calculateDDM, type DDMInputs } from "@/lib/valuation/ddm";
import { formatCompactCurrency } from "@/lib/utils";
import { ResultCard } from "@/components/tools/ResultCard";

export default function DDMPage() {
  const [inputs, setInputs] = useState<DDMInputs>({
    dividendPerShare: 200,
    dividendGrowth5y: 5,
    dividendGrowthTerminal: 3,
    requiredReturn: 12,
  });

  const [result, setResult] = useState<ReturnType<typeof calculateDDM> | null>(
    null,
  );
  const [currentPrice, setCurrentPrice] = useState(4500);

  const handleCalculate = () => {
    try {
      const res = calculateDDM(inputs, currentPrice);
      setResult(res);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Calculation error");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">
          💰 Dividend Discount Model (DDM)
        </h2>
        <p className="text-muted-foreground">
          Value dividend-paying stocks by discounting expected future dividends.
        </p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-card rounded-xl border">
        <NumberInput
          label="Current Price (for comparison)"
          value={currentPrice}
          onChange={setCurrentPrice}
          prefix="Rp"
          step={100}
        />
        <NumberInput
          label="Dividend per Share"
          value={inputs.dividendPerShare}
          onChange={(v) => setInputs({ ...inputs, dividendPerShare: v })}
          prefix="Rp"
          step={10}
          hint="Annual dividend payment per share"
        />
        <NumberInput
          label="Dividend Growth (5y)"
          value={inputs.dividendGrowth5y}
          onChange={(v) => setInputs({ ...inputs, dividendGrowth5y: v })}
          suffix="%"
          min={-10}
          max={30}
        />
        <NumberInput
          label="Terminal Growth"
          value={inputs.dividendGrowthTerminal}
          onChange={(v) => setInputs({ ...inputs, dividendGrowthTerminal: v })}
          suffix="%"
          min={0}
          max={8}
          hint="Long-term perpetual growth"
        />
        <NumberInput
          label="Required Return"
          value={inputs.requiredReturn}
          onChange={(v) => setInputs({ ...inputs, requiredReturn: v })}
          suffix="%"
          min={8}
          max={25}
          step={0.5}
          hint="Your minimum acceptable return"
        />
      </div>

      <button onClick={handleCalculate} className="btn btn-primary">
        🧮 Calculate Fair Value
      </button>

      {/* Results */}
      {result && (
        <ResultCard
          title="DDM Fair Value"
          value={formatCompactCurrency(result.fairValuePerShare, "IDR", 0)}
          upside={result.impliedUpside}
          currentPrice={currentPrice}
          assumptions={result.assumptions}
        />
      )}

      {/* Educational Note */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-800 dark:text-blue-200">
        💡 <strong>When to use DDM:</strong> Best for mature, dividend-paying
        companies with stable payout policies (e.g., banks, utilities, consumer
        staples). Not suitable for growth stocks that reinvest all earnings.
      </div>
    </div>
  );
}
