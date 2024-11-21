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
  salesTrends: any[]; // Define proper type based on your data
  categorySales: any[]; // Define proper type based on your data
  topProducts: any[]; // Define proper type based on your data
}
