// components/dashboard/analytics/index.ts
import React from "react";
export { SalesTrendChart } from "./SalesTrendChart";
export { RevenueChart } from "./RevenueChart";
export { OrderVolume } from "./OrderVolume";
export { CategoryBreakdown } from "./CategoryBreakdown";
export { TopProducts } from "./TopProducts";
export { AnalyticsCard } from "./AnalyticsCard";

// components/dashboard/analytics/AnalyticsGrid.tsx
import { ReactNode } from "react";

interface AnalyticsGridProps {
  children: ReactNode;
}

export function AnalyticsGrid({ children }: AnalyticsGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{children}</div>
  );
}
