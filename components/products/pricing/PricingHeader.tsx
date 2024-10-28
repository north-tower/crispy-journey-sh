// components/pricing/PricingHeader.tsx
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  Plus,
  LucideIcon,
} from "lucide-react";
import { PricingMetrics } from "@/types/pricing";

interface PricingHeaderProps {
  metrics: PricingMetrics | null;
  loading: boolean;
}

export function PricingHeader({ metrics, loading }: PricingHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Title Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">
            Pricing Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage and optimize your product pricing strategy
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-xl hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Update Prices</span>
          </motion.button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStat
          title="Average Margin"
          value={loading ? "-" : `${metrics?.averageMargin}%`}
          trend={metrics?.marginTrend}
          icon={DollarSign}
          loading={loading}
        />
        <QuickStat
          title="Recent Changes"
          value={loading ? "-" : metrics?.recentChanges}
          icon={TrendingUp}
          loading={loading}
        />
        <QuickStat
          title="Scheduled Updates"
          value={loading ? "-" : metrics?.scheduledChanges}
          icon={Calendar}
          loading={loading}
        />
        <QuickStat
          title="Promotional Items"
          value={loading ? "-" : metrics?.promotionalProducts}
          icon={DollarSign}
          loading={loading}
        />
      </div>
    </div>
  );
}

interface QuickStatProps {
  title: string;
  value: string | number | undefined;
  trend?: number;
  icon: LucideIcon;
  loading: boolean;
}

function QuickStat({
  title,
  value,
  trend,
  icon: Icon,
  loading,
}: QuickStatProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="p-6 bg-white rounded-2xl border border-gray-100"
    >
      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-20 bg-gray-100 rounded" />
          <div className="h-6 w-16 bg-gray-100 rounded" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{title}</span>
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-2xl font-semibold text-gray-900">
              {value}
            </span>
            {trend && (
              <span
                className={`text-sm ${
                  trend > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend > 0 ? "+" : ""}
                {trend}%
              </span>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}
