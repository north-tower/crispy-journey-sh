import { CategorySales, ProductPerformance, SalesTrend } from "@/types/dashboard";

// types/dashboard.ts
export type TimeRange = "daily" | "weekly" | "monthly" | "yearly";

export interface Stats {
  totalSales: {
    value: number;
    change: {
      trend: "up" | "down";
      percentage: number;
    };
  };
  salesTrends: SalesTrend[]; // Define proper type based on your data
  categorySales: CategorySales[]; // Define proper type based on your data
  topProducts: ProductPerformance[]; // Define proper type based on your data
}
