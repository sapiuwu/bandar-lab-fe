"use client";

import { ReactNode } from "react";

interface MetricGroupProps {
  title: string;
  icon?: string;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  collapsible?: boolean;
}

export function MetricGroup({
  title,
  icon,
  description,
  children,
  defaultOpen = true,
  collapsible = false,
}: MetricGroupProps) {
  return (
    <section className="bg-card rounded-xl border overflow-hidden print:break-inside-avoid">
      {/* Header */}
      <div
        className={`p-4 border-b ${collapsible ? "cursor-pointer hover:bg-muted/50" : ""}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && <span className="text-lg">{icon}</span>}
            <h3 className="font-semibold">{title}</h3>
          </div>
          {collapsible && (
            <button className="text-muted-foreground hover:text-foreground print:hidden">
              <span className="transform transition-transform">▼</span>
            </button>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      {/* Content */}
      <div className="p-4">{children}</div>
    </section>
  );
}
