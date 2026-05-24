"use client";

interface ScoreGaugeProps {
  score: number;
  label: string;
  variant?: "default" | "success" | "warning" | "danger";
}

export function ScoreGauge({
  score,
  label,
  variant = "default",
}: ScoreGaugeProps) {
  const getColorClasses = () => {
    if (variant !== "default") {
      switch (variant) {
        case "success":
          return "text-green-700 bg-green-50 border-green-200";
        case "warning":
          return "text-yellow-700 bg-yellow-50 border-yellow-200";
        case "danger":
          return "text-red-700 bg-red-50 border-red-200";
        default:
          return "text-gray-700 bg-gray-50 border-gray-200";
      }
    }
    // Auto color based on score
    if (score >= 70) return "text-green-700 bg-green-50 border-green-200";
    if (score >= 40) return "text-yellow-700 bg-yellow-50 border-yellow-200";
    return "text-red-700 bg-red-50 border-red-200";
  };

  return (
    <div
      className={`p-5 rounded-xl border flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] ${getColorClasses()}`}
    >
      <span className="text-4xl font-bold">{score}</span>
      <span className="text-sm font-medium mt-1 opacity-80">{label}</span>
    </div>
  );
}
