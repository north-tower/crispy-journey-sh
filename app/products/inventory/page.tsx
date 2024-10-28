"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  BarChart2,
  Box,
  LucideIcon,
  PackageOpen,
  RefreshCcw,
  Settings,
  TrendingDown,
  TrendingUp,
  Truck,
} from "lucide-react";
import { InventoryOverview } from "@/components/products/inventory/InventoryOverview";
import { LowStockAlerts } from "@/components/products/inventory/LowStockAlerts";
import { RestockSuggestions } from "@/components/products/inventory/RestockSuggestions";
import { StockHistory } from "@/components/products/inventory/StockHistory";

export default function InventoryPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "day" | "week" | "month"
  >("week");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-gray-900">
                Inventory Management
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-medium bg-primary-50 text-primary-600 rounded-full">
                Live Updates
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Track and manage your product inventory levels
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRefresh}
              className={`p-2 rounded-xl border border-gray-200 text-gray-600 hover:border-gray-300 ${
                isRefreshing ? "bg-gray-50" : "bg-white"
              }`}
            >
              <RefreshCcw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
            >
              <Settings className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
            >
              <PackageOpen className="w-4 h-4" />
              <span className="text-sm font-medium">Update Stock</span>
            </motion.button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InventoryStatCard
            title="Total Stock Value"
            value="$124,567"
            change={12.5}
            icon={Box}
            color="primary"
          />
          <InventoryStatCard
            title="Low Stock Items"
            value="23"
            change={-5.2}
            icon={AlertCircle}
            color="warning"
          />
          <InventoryStatCard
            title="Incoming Stock"
            value="45"
            change={8.7}
            icon={Truck}
            color="success"
          />
          <InventoryStatCard
            title="Stock Turnover"
            value="2.4x"
            change={3.1}
            icon={BarChart2}
            color="info"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <InventoryOverview timeframe={selectedTimeframe} />
            <StockHistory />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <LowStockAlerts />
            <RestockSuggestions />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

interface InventoryStatCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  color: "primary" | "warning" | "success" | "info";
}

function InventoryStatCard({
  title,
  value,
  change,
  icon: Icon,
  color,
}: InventoryStatCardProps) {
  const colorVariants = {
    primary: "bg-primary-50 text-primary-600",
    warning: "bg-yellow-50 text-yellow-600",
    success: "bg-green-50 text-green-600",
    info: "bg-blue-50 text-blue-600",
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="p-6 bg-white rounded-2xl border border-gray-100 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-xl ${colorVariants[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div
          className={`flex items-center gap-1 text-sm ${
            change > 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {change > 0 ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {Math.abs(change)}%
        </div>
      </div>

      <div>
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
      </div>
    </motion.div>
  );
}
