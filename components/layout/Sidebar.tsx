"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type MenuItem = {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  children?: MenuItem[];
};

interface SidebarProps {
  items: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
}

// 🔹 Recursive Menu Item Component
function MenuItemComponent({
  item,
  level = 0,
  onNavigate,
}: {
  item: MenuItem;
  level?: number;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.href && pathname === item.href;

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    } else {
      onNavigate();
    }
  };

  return (
    <div className="select-none">
      <Link
        href={item.href || "#"}
        onClick={handleClick}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
          ${level === 0 ? "font-medium" : level === 1 ? "ml-4" : "ml-8"}
          ${
            isActive
              ? "bg-primary/10 text-primary font-semibold"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }
        `}
      >
        {item.icon && <span className="w-4 h-4">{item.icon}</span>}
        <span className="flex-1">{item.label}</span>

        {hasChildren && (
          <span
            className={`text-xs transition-transform ${isExpanded ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        )}
      </Link>

      {/* Render children with slide animation */}
      {hasChildren && isExpanded && (
        <div className="overflow-hidden transition-all duration-200">
          {item.children!.map((child, idx) => (
            <MenuItemComponent
              key={idx}
              item={child}
              level={level + 1}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar({ items, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50 w-64 bg-card border-r 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          flex flex-col
        `}
      >
        {/* Logo/Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <Link
            href="/"
            className="font-bold text-xl text-primary"
            onClick={onClose}
          >
            📊 StockAnalyzer
          </Link>
          {/* Mobile close button */}
          <button
            className="md:hidden p-1 rounded hover:bg-muted"
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {items.map((item, idx) => (
            <MenuItemComponent
              key={idx}
              item={item}
              level={0}
              onNavigate={onClose}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t text-xs text-muted-foreground">
          <p>v1.0 • Demo Mode</p>
          <p className="mt-1">© 2026 StockAnalyzer</p>
        </div>
      </aside>
    </>
  );
}
