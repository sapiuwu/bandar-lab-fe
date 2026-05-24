'use client';

import React from 'react';

// 🔢 Number Input
interface NumberInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberInput({ label, value, onChange, suffix = '', min, max, step = 0.01 }: NumberInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            onChange(isNaN(v) ? 0 : v);
          }}
          min={min}
          max={max}
          step={step}
          className="w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {suffix && (
          <span className="absolute right-3 top-2 text-muted-foreground text-sm pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

// 🔘 Toggle Input (Checkbox style)
interface ToggleInputProps {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

export function ToggleInput({ label, checked, onChange }: ToggleInputProps) {
  return (
    <label className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
      <span className="text-sm font-medium">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <div className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-muted'}`}>
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
    </label>
  );
}

// 💡 Tooltip
interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <div className="group relative inline-flex">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-900 rotate-45" />
      </div>
    </div>
  );
}