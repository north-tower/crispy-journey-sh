// components/pricing/PricingOverview/index.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { PricingMetrics } from "@/types/pricing";
import { formatCurrency } from "@/lib/utils/charts";
import { PriceDistribution } from "./PriceDistribution";
import { MarginChart } from "./MarginChart";

interface PricingOverviewProps {
  metrics: PricingMetrics | null;
  loading: boolean;
}

export function PricingOverview({ metrics, loading }: PricingOverviewProps) {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d">("30d");
  const [view, setView] = useState<"margin" | "distribution">("margin");

  if (loading) {
    return <PricingOverviewSkeleton />;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-50 rounded-xl">
              <TrendingUp className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Pricing Overview
              </h2>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500">
                  Average margin is {metrics?.averageMargin}%
                </p>
                {metrics?.marginTrend && (
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      metrics.marginTrend > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {metrics.marginTrend > 0 ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {Math.abs(metrics.marginTrend)}%
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex p-1 bg-gray-50 rounded-xl">
              <button
                onClick={() => setView("margin")}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  view === "margin"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Margin Trend
              </button>
              <button
                onClick={() => setView("distribution")}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  view === "distribution"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Distribution
              </button>
            </div>

            {/* Time Range Selector */}
            <div className="flex p-1 bg-gray-50 rounded-xl">
              {["7d", "30d", "90d"].map((range) => (
                <motion.button
                  key={range}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTimeframe(range as any)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    timeframe === range
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {range}
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:border-gray-300 transition-colors"
            >
              <Filter className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <DollarSign className="w-4 h-4" />
              Total Revenue
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(metrics?.totalRevenue || 0)}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <TrendingUp className="w-4 h-4" />
              Average Margin
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {metrics?.averageMargin}%
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Calendar className="w-4 h-4" />
              Recent Changes
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {metrics?.recentChanges}
            </p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {view === "margin" ? (
            <motion.div
              key="margin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MarginChart timeframe={timeframe} />
            </motion.div>
          ) : (
            <motion.div
              key="distribution"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PriceDistribution />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PricingOverviewSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="animate-pulse space-y-6">
          <div className="flex justify-between">
            <div className="space-y-2">
              <div className="h-5 w-40 bg-gray-100 rounded" />
              <div className="h-4 w-24 bg-gray-100 rounded" />
            </div>
            <div className="h-8 w-64 bg-gray-100 rounded-xl" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="h-[400px] bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}
