"use client";
import { StatsGrid } from "@/components/dashboard/stats/StatsGrid";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useDashboardStats } from "@/lib/hooks/useDashboardStats";
import { motion, AnimatePresence } from "framer-motion";

import {
  AnalyticsGrid,
  RevenueChart,
  OrderVolume,
  CategoryBreakdown,
  TopProducts,
} from "@/components/dashboard/analytics";
import {
  ArrowUpRight,
  Calendar,
  ChevronDown,
  Cpu,
  Download,
  Filter,
  RefreshCcw,
} from "lucide-react";
import { TimeRange } from "@/types/dashboard";
import { useState } from "react";

export default function Home() {
  const { stats, loading, error, refreshStats, filterByTimeRange } =
    useDashboardStats();
  const [timeRange, setTimeRange] = useState<TimeRange>("monthly");
  const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false);

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    setShowTimeRangeDropdown(false);
    filterByTimeRange(range);
  };

  const timeRangeOptions: { label: string; value: TimeRange }[] = [
    { label: "Today", value: "daily" },
    { label: "This Week", value: "weekly" },
    { label: "This Month", value: "monthly" },
    { label: "This Year", value: "yearly" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Enhanced Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-gray-900">
                Dashboard
              </h1>
              {!loading && !error && stats && (
                <div className="flex items-center gap-1 px-2 py-1 bg-primary-50 rounded-full">
                  <Cpu className="w-4 h-4 text-primary-500" />
                  <span className="text-xs font-medium text-primary-600">
                    Live
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">
                Overview of your store's performance
              </p>
              {!loading &&
                !error &&
                stats &&
                stats.totalSales.change.trend === "up" && (
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>{stats.totalSales.change.percentage}% up</span>
                  </div>
                )}
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            {/* Time Range Selector */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowTimeRangeDropdown(!showTimeRangeDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-primary-100 transition-colors"
              >
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {
                    timeRangeOptions.find((opt) => opt.value === timeRange)
                      ?.label
                  }
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                    showTimeRangeDropdown ? "rotate-180" : ""
                  }`}
                />
              </motion.button>

              <AnimatePresence>
                {showTimeRangeDropdown && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-20"
                      onClick={() => setShowTimeRangeDropdown(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-30"
                    >
                      {timeRangeOptions.map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{
                            x: 4,
                            backgroundColor: "rgb(249 250 251)",
                          }}
                          onClick={() => handleTimeRangeChange(option.value)}
                          className={`w-full px-4 py-2 text-sm text-left transition-colors ${
                            timeRange === option.value
                              ? "text-primary-600 bg-primary-50"
                              : "text-gray-700 hover:text-gray-900"
                          }`}
                        >
                          {option.label}
                        </motion.button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={refreshStats}
                disabled={loading}
                className="p-2 text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-primary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCcw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-2 text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-primary-100 transition-colors"
              >
                <Download className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-2 text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-primary-100 transition-colors"
              >
                <Filter className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Quick Stats Loading */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
                {[...Array(7)].map((_, i) => (
                  <motion.div
                    key={`stat-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: i * 0.1 },
                    }}
                    className="relative overflow-hidden h-[160px] bg-gray-50 rounded-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent skeleton-animation" />
                  </motion.div>
                ))}
              </div>

              {/* Analytics Loading */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={`analytics-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: (i + 7) * 0.1 },
                    }}
                    className="relative overflow-hidden h-[400px] bg-gray-50 rounded-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent skeleton-animation" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-6 rounded-2xl bg-red-50 border border-red-100"
            >
              <div className="flex items-center gap-3 text-red-600">
                <span className="text-lg">Failed to load dashboard stats</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={refreshStats}
                  className="px-4 py-2 bg-white rounded-xl text-sm hover:bg-red-50 transition-colors"
                >
                  Try Again
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-6"
            >
              {/* Quick Stats */}
              <StatsGrid stats={stats!} />

              {/* Analytics Section */}
              <AnalyticsGrid>
                {/* Revenue Analysis */}
                <RevenueChart data={stats!.salesTrends} target={100000} />

                {/* Order Volume */}
                <OrderVolume data={stats!.salesTrends} />

                {/* Category Breakdown */}
                <CategoryBreakdown data={stats!.categorySales} />

                {/* Top Products */}
                <TopProducts products={stats!.topProducts} />
              </AnalyticsGrid>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .skeleton-animation {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </DashboardLayout>
  );
}
