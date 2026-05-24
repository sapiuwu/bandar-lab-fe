"use client";

import { useState, ReactNode } from "react";
import { Sidebar, MenuItem } from "./Sidebar";
import { Navbar } from "./Navbar";
import { MobileOverlay } from "./MobileOverlay";

interface LayoutProps {
  children: ReactNode;
}

// 🗂️ Define your 3-level menu structure here
const MENU_ITEMS: MenuItem[] = [
  {
    label: "Dashboard",
    icon: "📊",
    href: "/",
  },
  {
    label: "Stocks",
    icon: "📈",
    children: [
      {
        label: "Watchlist",
        href: "/#watchlist",
      },
      {
        label: "Screener",
        href: "/screener",
      },
    ],
  },
  {
    label: "Analysis",
    icon: "🔍",
    children: [
      {
        label: "Valuation Tools",
        children: [
          { label: "DCF Calculator", href: "/tools/dcf" },
          { label: "DDM Model", href: "/tools/ddm" },
          { label: "Buffett Method", href: "/tools/buffett" },
        ],
      },
      {
        label: "Reports",
        href: "/reports",
      },
    ],
  },
  {
    label: "Portfolio",
    icon: "💼",
    href: "/portfolio",
  },
  {
    label: "Settings",
    icon: "⚙️",
    href: "/settings",
  },
];

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Overlay */}
      <MobileOverlay isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Sidebar */}
      <Sidebar items={MENU_ITEMS} isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
