interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md";
}

export function ScoreBadge({ score, size = "md" }: ScoreBadgeProps) {
  const getColor = () => {
    if (score >= 70) return "bg-green-100 text-green-700 border-green-200";
    if (score >= 40) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  const sizeClasses =
    size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center justify-center font-bold rounded-full border ${getColor()} ${sizeClasses}`}
    >
      {score}
    </span>
  );
}
