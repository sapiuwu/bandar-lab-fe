"use client";

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  suffix?: string;
  prefix?: string;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  id?: string;
}

export function NumberInput({
  label,
  value,
  onChange,
  suffix,
  prefix,
  min,
  max,
  step = 0.01,
  hint,
  id,
}: NumberInputProps) {
  const inputId = id || `input-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-muted-foreground flex items-center gap-1"
      >
        {label}
        {hint && (
          <span className="group relative">
            <span className="cursor-help text-muted-foreground hover:text-foreground">
              ⓘ
            </span>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 w-48">
              {hint}
            </span>
          </span>
        )}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          type="number"
          value={value}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            onChange(isNaN(val) ? 0 : val);
          }}
          min={min}
          max={max}
          step={step}
          className={`w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            prefix ? "pl-8" : ""
          } ${suffix ? "pr-10" : ""}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
