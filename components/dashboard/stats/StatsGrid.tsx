import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Package,
  AlertTriangle,
  Heart,
} from "lucide-react";
import { StatsCard } from "./StatsCard";
import { DashboardStats } from "@/types/dashboard";

interface StatsGridProps {
  stats: DashboardStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <StatsCard
        data={{
          ...stats.totalSales,
          icon: DollarSign,
          color: "primary",
        }}
      />
      <StatsCard
        data={{
          ...stats.orderCount,
          icon: ShoppingCart,
          color: "success",
        }}
      />
      <StatsCard
        data={{
          ...stats.revenueMetrics,
          icon: TrendingUp,
          color: "info",
        }}
      />
      <StatsCard
        data={{
          ...stats.averageOrderValue,
          icon: ShoppingCart,
          color: "primary",
        }}
      />
      <StatsCard
        data={{
          ...stats.totalProducts,
          icon: Package,
          color: "success",
        }}
      />
      <StatsCard
        data={{
          ...stats.stockAlerts,
          icon: AlertTriangle,
          color: "warning",
        }}
      />
      <StatsCard
        data={{
          ...stats.customerSatisfaction,
          icon: Heart,
          color: "error",
        }}
      />
    </div>
  );
}
