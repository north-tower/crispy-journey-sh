// components/dashboard/DashboardHeader.tsx
import { memo } from "react";
import { TimeRangeSelector } from "./TimeRangeSelector";
import { ActionButtons } from "./ActionButtons";
import { ArrowUpRight, Cpu } from "lucide-react";
import { Stats, TimeRange } from "./types/dashboard";

interface DashboardHeaderProps {
  stats: Stats | null;
  loading: boolean;
  timeRange: TimeRange;
  showTimeRangeDropdown: boolean;
  onTimeRangeChange: (range: TimeRange) => void;
  onTimeRangeToggle: () => void;
  onRefresh: () => void;
}

export const DashboardHeader = memo(function DashboardHeader({
  stats,
  loading,
  timeRange,
  showTimeRangeDropdown,
  onTimeRangeChange,
  onTimeRangeToggle,
  onRefresh,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          {!loading && stats && (
            <div className="flex items-center gap-1 px-2 py-1 bg-primary-50 rounded-full">
              <Cpu className="w-4 h-4 text-primary-500" />
              <span className="text-xs font-medium text-primary-600">Live</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500">
            Overview of your store's performance
          </p>
          {!loading && stats?.totalSales.change.trend === "up" && (
            <div className="flex items-center gap-1 text-sm text-green-600">
              <ArrowUpRight className="w-4 h-4" />
              <span>{stats.totalSales.change.percentage}% up</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 self-stretch sm:self-auto">
        <TimeRangeSelector
          timeRange={timeRange}
          showDropdown={showTimeRangeDropdown}
          onToggle={onTimeRangeToggle}
          onChange={onTimeRangeChange}
        />
        <ActionButtons onRefresh={onRefresh} loading={loading} />
      </div>
    </div>
  );
});
