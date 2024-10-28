export type TimeFrame = "daily" | "weekly" | "monthly" | "yearly";

export interface SalesTrend {
  date: string;
  revenue?: number;
  orders?: number;
  sales?: number;
}

export interface CategorySales {
  category: string;
  sales: number;
  percentage: number;
  trend: number;
}

export interface ProductPerformance {
  id: string;
  name: string;
  revenue: number;
  sales: number;
  trend: number;
  image?: string;
}

export interface AnalyticsData {
  salesTrends: SalesTrend[];
  categorySales: CategorySales[];
  topProducts: ProductPerformance[];
  summary: {
    totalSales: number;
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
  };
}
