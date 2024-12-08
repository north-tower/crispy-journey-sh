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
import { motion } from "framer-motion";
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
import { useOrderVolumeStats } from "@/lib/hooks/useOrderVolumeStats";


export function OrderVolume({ className }: { className?: string }) {
  const [timeFilter, setTimeFilter] = useState<"24h" | "7d" | "30d">("7d");
  const [orderType, setOrderType] = useState<"all" | "completed" | "pending">("all");

  // Use the custom hook to fetch order data based on timeFilter and orderType
  const { orderData, loading, error } = useOrderVolumeStats(timeFilter, orderType);

  // Stats calculation
  const stats = useMemo(() => {
    if (!orderData || orderData.orderVolume?.length === 0) {
      return {
        total: 0,
        average: 0,
        growth: 0,
        peak: 0,
      };
    }

    const totalOrders = orderData.orderVolume.reduce(
      (sum, item) => sum + (item.orders || 0),
      0
    );
    const midPoint = Math.floor(orderData.orderVolume.length / 2);

    const previousPeriod = orderData.orderVolume
      .slice(0, midPoint)
      .reduce((sum, item) => sum + (item.orders || 0), 0);

    const currentPeriod = orderData.orderVolume
      .slice(midPoint)
      .reduce((sum, item) => sum + (item.orders || 0), 0);

    const orderValues = orderData.orderVolume.map((item) => item.orders || 0);

    return {
      total: totalOrders,
      average: totalOrders / orderData.orderVolume.length,
      growth: calculateGrowth(previousPeriod, currentPeriod),
      peak: Math.max(...orderValues),
    };
  }, [orderData]);

  // Early return for loading state or errors
  if (loading) {
    return (
      <div
        className={`bg-white rounded-2xl border border-gray-100 p-6 ${className}`}
      >
        <div className="flex flex-col items-center justify-center h-[300px]">
          <p className="text-gray-500">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-white rounded-2xl border border-gray-100 p-6 ${className}`}
      >
        <div className="flex flex-col items-center justify-center h-[300px]">
          <p className="text-red-500">Error: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 p-6 ${className}`}
    >
      {/* Header with Filters */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Order Volume</h3>
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
  
          {/* Controls (Filters) */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Time Filter */}
            <div className="flex p-1 bg-gray-50 rounded-xl">
              {["24h", "7d", "30d"].map((option) => (
                <motion.button
                  key={option}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTimeFilter(option)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200
                    ${timeFilter === option ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  {option}
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
                  onClick={() => setOrderType(option.value)}
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
  
        {/* Conditional Rendering for Stats and Chart */}
        {!orderData || !orderData.orderVolume || orderData.orderVolume.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px]">
            <ShoppingCart className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500">No order data available</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              {/* <StatsBox
                title="Processing Time"
                value="2.5 hours"
                icon={Clock}
                subtitle="Average"
              /> */}
            </div>
  
            {/* Chart */}
            <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {/* <AreaChart
          width={500}
          height={400}
          data={orderData.orderVolume}
          margin={{
            top: 10,
            right: 50,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="orders" stroke="#8884d8" fill="#8884d8" />
        </AreaChart> */}
        <AreaChart
         width={500}
         height={400}
              data={orderData.orderVolume}
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
          </>
        )}
      </div>
    </div>
  );
  
}
