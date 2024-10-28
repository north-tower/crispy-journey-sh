"use client";

import { TableProperties, Grid2X2 } from "lucide-react";

interface ViewToggleProps {
  currentView: "table" | "grid";
  onViewChange: (view: "table" | "grid") => void;
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center bg-muted rounded-lg p-1">
      <button
        onClick={() => onViewChange("table")}
        className={`p-2 rounded-md transition-all ${
          currentView === "table"
            ? "bg-white text-primary-600 shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Table view"
      >
        <TableProperties className="h-5 w-5" />
      </button>
      <button
        onClick={() => onViewChange("grid")}
        className={`p-2 rounded-md transition-all ${
          currentView === "grid"
            ? "bg-white text-primary-600 shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Grid view"
      >
        <Grid2X2 className="h-5 w-5" />
      </button>
    </div>
  );
}
