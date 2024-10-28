"use client";

import { useState, useMemo, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PerformanceCharts } from "@/components/reports/performance/PerformanceCharts";
import { CategoryPerformance } from "@/components/reports/performance/CategoryPerformance";
import { LineChart, Target, ThumbsUp, Timer } from "lucide-react";
import { PerformanceMetric } from "@/types/performance";
import { PerformanceMetrics } from "@/components/reports/performance/performance";
import { debounce } from "lodash";

const performanceMetrics: PerformanceMetric[] = [
  {
    title: "Conversion Rate",
    value: "3.42%",
    change: "+0.8%",
    icon: Target,
    trend: "up" as const,
  },
  {
    title: "Avg. Processing Time",
    value: "1.2 days",
    change: "-12%",
    icon: Timer,
    trend: "up" as const,
  },
  {
    title: "Customer Satisfaction",
    value: "4.8/5",
    change: "+0.3",
    icon: ThumbsUp,
    trend: "up" as const,
  },
];

export default function Performance() {
  const [timeRange, setTimeRange] = useState("30");
  const [category, setCategory] = useState("all");

  // Memoize performance metrics
  const metrics = useMemo(() => performanceMetrics, []);

  // Debounced time range and category change
  const handleTimeRangeChange = useCallback(
    debounce((newTimeRange) => setTimeRange(newTimeRange), 200),
    []
  );
  const handleCategoryChange = useCallback(
    debounce((newCategory) => setCategory(newCategory), 200),
    []
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-50 rounded-xl">
              <LineChart className="w-5 h-5 text-primary-500" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Performance
            </h1>
          </div>

          <div className="flex gap-3">
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm"
            >
              <option value="all">All Products</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
            </select>

            <select
              value={timeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>

        <PerformanceMetrics metrics={metrics} />
        <PerformanceCharts />
        <CategoryPerformance />
      </div>
    </DashboardLayout>
  );
}
