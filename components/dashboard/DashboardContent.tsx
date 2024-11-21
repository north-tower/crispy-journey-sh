// components/dashboard/DashboardContent.tsx
import { memo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalyticsGridSkeleton } from './analytics/AnalyticsGridSkeleton';
import { Stats } from './types/dashboard';
import { StatsGrid } from './stats/StatsGrid';

// Dynamically import heavy components
const AnalyticsComponents = {
  AnalyticsGrid: dynamic(() => import("@/components/dashboard/analytics").then(mod => mod.AnalyticsGrid), {
    loading: () => <AnalyticsGridSkeleton />
  }),
  RevenueChart: dynamic(() => import("@/components/dashboard/analytics").then(mod => mod.RevenueChart), {
    ssr: false
  }),
  OrderVolume: dynamic(() => import("@/components/dashboard/analytics").then(mod => mod.OrderVolume), {
    ssr: false
  }),
  CategoryBreakdown: dynamic(() => import("@/components/dashboard/analytics").then(mod => mod.CategoryBreakdown), {
    ssr: false
  }),
  TopProducts: dynamic(() => import("@/components/dashboard/analytics").then(mod => mod.TopProducts))
};

interface DashboardContentProps {
  stats: Stats | null;
  loading: boolean;
  error: Error | null;
  onRetry: () => void;
}

export const DashboardContent = memo(function DashboardContent({
  stats,
  loading,
  error,
  onRetry
}: DashboardContentProps) {
  if (loading) {
    return <AnalyticsGridSkeleton />;
  }

  if (error) {
    return (
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
            onClick={onRetry}
            className="px-4 py-2 bg-white rounded-xl text-sm hover:bg-red-50 transition-colors"
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="space-y-6"
    >
      <StatsGrid stats={stats} />

      <AnalyticsComponents.AnalyticsGrid>
        <AnalyticsComponents.RevenueChart data={stats.salesTrends} target={100000} />
        <AnalyticsComponents.OrderVolume data={stats.salesTrends} />
        <AnalyticsComponents.CategoryBreakdown data={stats.categorySales} />
        <AnalyticsComponents.TopProducts products={stats.topProducts} />
      </AnalyticsComponents.AnalyticsGrid>
    </motion.div>
  );
});