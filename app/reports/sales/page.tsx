"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SalesTrend } from "@/components/reports/sales/SalesTrend";
import {
  BarChart,
  Download,
  Filter,
  DollarSign,
  Package,
  Users,
  TrendingUp,
  LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { TopProducts } from "@/components/reports/sales/TopProducts";
import { SalesMetrics } from "@/components/reports/sales/SalesMetrics";
import { exportSalesReport } from "@/lib/utils/exportData";
import { debounce } from "lodash";
import { PricingMetrics } from "@/types/pricing";
import { API_BASE_URL } from "@/services/products";

// Types
interface SalesData {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: "up" | "down";
}

interface MonthlySalesData {
  month: string;
  amount: number;
}

export default function SalesReport() {
  const [timeRange, setTimeRange] = useState<string>("monthly"); // Default time range
  const [metrics, setMetrics] = useState<SalesData[]>([]);
  const [salesData, setSalesData] = useState<MonthlySalesData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch data from the backend
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/overview/sales-metrics?timeRange=${timeRange}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch sales metrics");
      }

      const data = await response.json();

      // Map the data into the format required for metrics and sales trend
      setMetrics(
        data.salesMetrics.map((metric: PricingMetrics) => ({
          title: metric.title,
          value: metric.value,
          change: metric.change,
          icon: getIcon(metric.icon), // Map icon strings to actual components
          trend: metric.trend,
        }))
      );

      setSalesData(data.monthlySales);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  // Fetch data on mount and whenever timeRange changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Debounced time range change handler
  const handleTimeRangeChange = useCallback(
    debounce((newRange: string) => setTimeRange(newRange), 200),
    []
  );

  // Icon mapper
  const getIcon = (icon: string) => {
    switch (icon) {
      case "DollarSign":
        return DollarSign;
      case "Package":
        return Package;
      case "Users":
        return Users;
      case "TrendingUp":
        return TrendingUp;
      default:
        return null;
    }
  };

  // Optimized export handler
  const handleExport = async () => {
    try {
      await exportSalesReport(timeRange);
    } catch (error) {
      console.error("Failed to export report:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-50 rounded-xl">
              <BarChart className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Sales Report
              </h1>
              <p className="text-sm text-gray-500">
                Overview of your stores performance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm
                focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300"
            >
              <option value="daily">Last 24 hours</option>
              <option value="weekly">Last 7 days</option>
              <option value="monthly">Last 30 days</option>
              <option value="yearly">Last 12 months</option>
            </select>

            {/* Action Buttons */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              className="p-2 text-gray-500 hover:text-gray-700 bg-white border border-gray-200 
                rounded-xl hover:border-primary-100 transition-colors"
            >
              <Download className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-2 text-gray-500 hover:text-gray-700 bg-white border border-gray-200 
                rounded-xl hover:border-primary-100 transition-colors"
            >
              <Filter className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Metrics */}
        {loading ? (
          <p>Loading metrics...</p>
        ) : (
          <SalesMetrics metrics={metrics} />
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesTrend data={salesData} />
          <TopProducts timeRange={timeRange} />
        </div>
      </div>
    </DashboardLayout>
  );
}
