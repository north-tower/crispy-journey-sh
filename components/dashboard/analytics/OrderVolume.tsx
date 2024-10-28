// components/dashboard/analytics/OrderVolume.tsx
import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Clock,
} from "lucide-react";
import { formatNumber, calculateGrowth, chartTheme } from "@/lib/utils/charts";
import { StatsBox } from "./StatsBox";
import { SalesTrend } from "@/types/analytics";

interface OrderVolumeProps {
  data?: SalesTrend[];
  className?: string;
}

export function OrderVolume({ data = [], className }: OrderVolumeProps) {
  const [timeFilter, setTimeFilter] = useState<"24h" | "7d" | "30d">("7d");
  const [orderType, setOrderType] = useState<"all" | "completed" | "pending">(
    "all"
  );

  const stats = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        total: 0,
        average: 0,
        growth: 0,
        peak: 0,
      };
    }

    const totalOrders = data.reduce((sum, item) => sum + (item.orders || 0), 0);
    const midPoint = Math.floor(data.length / 2);

    const previousPeriod = data
      .slice(0, midPoint)
      .reduce((sum, item) => sum + (item.orders || 0), 0);

    const currentPeriod = data
      .slice(midPoint)
      .reduce((sum, item) => sum + (item.orders || 0), 0);

    const orderValues = data.map((item) => item.orders || 0);

    return {
      total: totalOrders,
      average: totalOrders / data.length,
      growth: calculateGrowth(previousPeriod, currentPeriod),
      peak: Math.max(...orderValues),
    };
  }, [data]);

  // Early return for no data
  if (!data || data.length === 0) {
    return (
      <div
        className={`bg-white rounded-2xl border border-gray-100 p-6 ${className}`}
      >
        <div className="flex flex-col items-center justify-center h-[300px]">
          <ShoppingCart className="w-12 h-12 text-gray-300 mb-3" />
          <p className="text-gray-500">No order data available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 p-6 ${className}`}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Order Volume
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div
                className={`flex items-center gap-1 text-sm ${
                  stats.growth > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stats.growth > 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {Math.abs(stats.growth)}% vs previous period
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Time Filter */}
            <div className="flex p-1 bg-gray-50 rounded-xl">
              {[
                { value: "24h", label: "24h" },
                { value: "7d", label: "7d" },
                { value: "30d", label: "30d" },
              ].map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTimeFilter(option.value as any)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200
                    ${
                      timeFilter === option.value
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>

            {/* Order Type Filter */}
            <div className="flex p-1 bg-gray-50 rounded-xl">
              {[
                { value: "all", label: "All" },
                { value: "completed", label: "Completed" },
                { value: "pending", label: "Pending" },
              ].map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setOrderType(option.value as any)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200
                    ${
                      orderType === option.value
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsBox
            title="Total Orders"
            value={formatNumber(stats.total)}
            icon={ShoppingCart}
            trend={stats.growth}
          />
          <StatsBox
            title="Average Orders"
            value={formatNumber(stats.average, { decimals: 1 })}
            icon={TrendingUp}
          />
          <StatsBox
            title="Peak Orders"
            value={formatNumber(stats.peak)}
            icon={Filter}
          />
          <StatsBox
            title="Processing Time"
            value="2.5 hours"
            icon={Clock}
            subtitle="Average"
          />
        </div>

        {/* Chart */}
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={chartTheme.colors.primary}
                    stopOpacity={0.1}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartTheme.colors.primary}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartTheme.grid.stroke}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: chartTheme.colors.gray, fontSize: 12 }}
                axisLine={{ stroke: chartTheme.grid.stroke }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: chartTheme.colors.gray, fontSize: 12 }}
                axisLine={{ stroke: chartTheme.grid.stroke }}
                tickLine={false}
                tickFormatter={(value) => formatNumber(value)}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;

                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-4 rounded-xl shadow-lg border border-gray-100"
                    >
                      <p className="text-sm font-medium text-gray-900">
                        {payload[0].payload.date}
                      </p>
                      <div className="mt-2">
                        <p className="text-sm flex items-center justify-between gap-4">
                          <span className="text-gray-500">Orders:</span>
                          <span className="font-medium text-primary-600">
                            {typeof payload[0].value === "number"
                              ? formatNumber(payload[0].value)
                              : 0}
                          </span>
                        </p>
                      </div>
                    </motion.div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke={chartTheme.colors.primary}
                strokeWidth={2}
                fill="url(#orderGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// StatsBox component remains the same
