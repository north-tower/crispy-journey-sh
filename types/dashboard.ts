// types/dashboard.ts
export type TimeRange = "daily" | "weekly" | "monthly" | "yearly";

export type TrendDirection = "up" | "down" | "neutral";

export interface StatChange {
  value: number;
  percentage: number;
  trend: TrendDirection;
  timeRange: TimeRange;
}

export interface StatData {
  id: string;
  title: string;
  value: number | string;
  change: StatChange;
  formattedValue?: string;
  icon?: React.ComponentType<any>;
  color?: "primary" | "success" | "warning" | "error" | "info";
  chart?: number[];
}

export interface SalesTrend {
  date: string;
  revenue: number;
  orders: number;
  sales: number;
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

export interface DashboardStats {
  totalSales: StatData;
  orderCount: StatData;
  revenueMetrics: StatData;
  averageOrderValue: StatData;
  totalProducts: StatData;
  stockAlerts: StatData;
  customerSatisfaction: StatData;
  salesTrends: SalesTrend[];
  categorySales: CategorySales[];
  topProducts: ProductPerformance[];
}
