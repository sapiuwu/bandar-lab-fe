import { ReactNode } from "react";
import Link from "next/link";

export default function ToolsLayout({ children }: { children: ReactNode }) {
  const tools = [
    { href: "/tools/dcf", label: "📊 DCF Model", desc: "Discounted Cash Flow" },
    { href: "/tools/ddm", label: "💰 DDM Model", desc: "Dividend Discount" },
    {
      href: "/tools/buffett",
      label: "🎯 Buffett Method",
      desc: "Owner Earnings Approach",
    },
  ];

  return (
    <div className="p-4 md:p-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/tools" className="hover:text-foreground">
          Tools
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground font-medium">Valuation</span>
      </nav>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">🧮 Valuation Tools</h1>
        <p className="text-muted-foreground">
          Estimate intrinsic value using proven investment frameworks.
        </p>
      </div>

      {/* Tools Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="px-4 py-2 rounded-lg border bg-card hover:bg-muted transition-colors group"
          >
            <div className="font-medium group-hover:text-primary">
              {tool.label}
            </div>
            <div className="text-xs text-muted-foreground">{tool.desc}</div>
          </Link>
        ))}
      </div>

      {/* Tool Content */}
      <div className="bg-card rounded-xl border p-4 md:p-6">{children}</div>
    </div>
  );
}
