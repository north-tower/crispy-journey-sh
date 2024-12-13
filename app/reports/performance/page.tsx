"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PerformanceMetrics } from "@/components/reports/performance/performance";
import { debounce } from "lodash";
import { Target, ThumbsUp, Timer } from "lucide-react";
import { PerformanceCharts } from "@/components/reports/performance/PerformanceCharts";
import { CategoryPerformance } from "@/components/reports/performance/CategoryPerformance";

interface PerformanceMetric {
  title: string;
  value: string;
  change: string;
  icon: any;
  trend: "up" | "down" | "neutral";
}

export default function Performance() {
  const [timeRange, setTimeRange] = useState("30");
  const [category, setCategory] = useState("all");
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPerformanceMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8900/api/orders/overview/perfomance?timeRange=${timeRange}&category=all`
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch performance metrics.");
      }
  
      const data = await response.json();
      setMetrics(
        data.metrics.map((metric: any) => ({
          title: metric.title,
          value: metric.value,
          change: `${metric.change.value > 0 ? '+' : ''}${metric.change.percentage}%`, // Correctly format the change
          icon: getIcon(metric.icon),
          trend: metric.trend,
        }))
      );
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [timeRange, category]);
  

  useEffect(() => {
    fetchPerformanceMetrics();
  }, [fetchPerformanceMetrics]);

  const handleTimeRangeChange = debounce((newTimeRange) => {
    setTimeRange(newTimeRange);
  }, 200);

  const handleCategoryChange = debounce((newCategory) => {
    setCategory(newCategory);
  }, 200);

  const getIcon = (icon: string) => {
    switch (icon) {
      case "Target":
        return Target;
      case "Timer":
        return Timer;
      case "ThumbsUp":
        return ThumbsUp;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex gap-3">
          {/* <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm"
          >
            <option value="all">All Products</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
          </select> */}
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
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <PerformanceMetrics metrics={metrics} />
          
        )}
        <PerformanceCharts />
        <CategoryPerformance />
      </div>
    </DashboardLayout>
  );
}
