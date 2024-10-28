// app/reports/sales/page.tsx
"use client";

import { useState, useCallback, useMemo } from "react";
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
} from "lucide-react";
import { motion } from "framer-motion";
import { TopProducts } from "@/components/reports/sales/TopProducts";
import { SalesMetrics } from "@/components/reports/sales/SalesMetrics";
import { exportSalesReport } from "@/lib/utils/exportData";
import { debounce } from "lodash";

// Types
interface SalesData {
  title: string;
  value: string;
  change: string;
  icon: any;
  trend: "up" | "down";
}

const salesMetrics: SalesData[] = [
  {
    title: "Total Revenue",
    value: "$24,563.00",
    change: "+12.5%",
    icon: DollarSign,
    trend: "up",
  },
  {
    title: "Total Orders",
    value: "1,463",
    change: "+8.2%",
    icon: Package,
    trend: "up",
  },
  {
    title: "Active Customers",
    value: "892",
    change: "+5.1%",
    icon: Users,
    trend: "up",
  },
  {
    title: "Avg. Order Value",
    value: "$168.45",
    change: "+3.2%",
    icon: TrendingUp,
    trend: "up",
  },
];

const monthlySales = [
  { month: "Jan", amount: 12400 },
  { month: "Feb", amount: 15200 },
  { month: "Mar", amount: 18100 },
  { month: "Apr", amount: 16400 },
  { month: "May", amount: 19800 },
  { month: "Jun", amount: 22400 },
];

export default function SalesReport() {
  const [timeRange, setTimeRange] = useState<string>("30");

  // Memoized sales metrics and monthly data
  const metrics = useMemo(() => salesMetrics, []);
  const salesData = useMemo(() => monthlySales, []);

  // Debounced time range change handler
  const handleTimeRangeChange = useCallback(
    debounce((newRange: string) => setTimeRange(newRange), 200),
    []
  );

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
                Overview of your store's performance
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
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last 12 months</option>
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
        <SalesMetrics metrics={metrics} />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesTrend data={salesData} />
          <TopProducts />
        </div>
      </div>
    </DashboardLayout>
  );
}
