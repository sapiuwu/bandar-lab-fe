"use client";

import { useState } from "react";

interface ExportMenuProps {
  onExportCSV: () => void;
  onExportPDF: () => void;
}

export function ExportMenu({ onExportCSV, onExportPDF }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = (format: "pdf" | "csv") => {
    if (format === "csv") {
      onExportCSV();
    } else {
      onExportPDF();
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-outline"
        title="Export report"
      >
        📤 Export
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-card border rounded-lg shadow-lg z-50 overflow-hidden">
            <button
              onClick={() => handleExport("pdf")}
              className="w-full px-4 py-2.5 text-left text-sm hover:bg-muted flex items-center gap-2"
            >
              📄 PDF (Print)
            </button>
            <button
              onClick={() => handleExport("csv")}
              className="w-full px-4 py-2.5 text-left text-sm hover:bg-muted flex items-center gap-2"
            >
              📊 CSV Data
            </button>
            <div className="border-t px-4 py-2 text-xs text-muted-foreground">
              PDF uses browser print dialog
            </div>
          </div>
        </>
      )}
    </div>
  );
}
