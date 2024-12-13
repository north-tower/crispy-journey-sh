import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Package,
  AlertTriangle,
  Heart,
} from "lucide-react";
import { StatsCard } from "./StatsCard";
import { useDashboardStats } from "@/lib/hooks/useDashboardStats";
import { useCallback, useState } from "react";
import { TimeRangeSelector } from "../TimeRangeSelector";
import { AnalyticsGridSkeleton } from "../analytics/AnalyticsGridSkeleton";

export function StatsGrid() {
  const { stats, loading, error, refreshStats, filterByTimeRange } = useDashboardStats();
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false);

  const handleTimeRangeChange = useCallback((range: "daily" | "weekly" | "monthly" | "yearly") => {
    console.log("handleTimeRangeChange called with:", range);
    setTimeRange(range);
    setShowTimeRangeDropdown(false);
    filterByTimeRange(range);
  }, [filterByTimeRange]);

  const toggleTimeRangeDropdown = useCallback(() => {
    setShowTimeRangeDropdown((prev) => !prev);
  }, []);

  if (loading) {
    return <AnalyticsGridSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-100 text-red-600 rounded-xl">
        <p>Failed to load stats. Please try again.</p>
        <button
          onClick={refreshStats}
          className="px-4 py-2 mt-2 bg-white rounded-lg text-sm hover:bg-red-100 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* Align TimeRangeSelector to the right */}
      <div className="col-span-full flex justify-end items-center">
        <TimeRangeSelector
          timeRange={timeRange}
          showDropdown={showTimeRangeDropdown}
          onToggle={toggleTimeRangeDropdown}
          onChange={handleTimeRangeChange}
        />
      </div>
      <StatsCard
        data={{
          ...stats.totalSales,
          icon: DollarSign,
        }}
      />
      <StatsCard
        data={{
          ...stats.orderCount,
          icon: ShoppingCart,
        }}
      />
      <StatsCard
        data={{
          ...stats.revenueMetrics,
          icon: TrendingUp,
        }}
      />
      <StatsCard
        data={{
          ...stats.averageOrderValue,
          icon: ShoppingCart,
        }}
      />
      <StatsCard
        data={{
          ...stats.totalProducts,
          icon: Package,
        }}
      />
      <StatsCard
        data={{
          ...stats.stockAlerts,
          icon: AlertTriangle,
        }}
      />
      {/* <StatsCard
        data={{
          ...stats.customerSatisfaction,
          icon: Heart,
        }}
      /> */}
    </div>
  );
}
