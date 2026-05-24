import { DCFCalculator } from "@/components/tools/DCFCalculator";

export default function DCFPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">📊 Discounted Cash Flow (DCF)</h2>
        <p className="text-muted-foreground">
          Estimate intrinsic value by projecting future free cash flows and
          discounting to present value.
        </p>
      </div>

      <DCFCalculator initialPrice={10000} />
    </div>
  );
}
