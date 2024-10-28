// components/inventory/RestockSuggestions/index.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Package,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Clock,
  DollarSign,
  Filter,
  LucideIcon,
} from "lucide-react";
import { RestockSuggestion, RestockMetrics } from "@/types/restock";

// Mock data
const mockSuggestions: RestockSuggestion[] = [
  {
    id: "1",
    productId: "p1",
    productName: "Wireless Earbuds Pro",
    currentStock: 5,
    recommendedQuantity: 50,
    priority: "critical",
    reason: "low_stock",
    averageDemand: 20,
    supplier: "Tech Supplies Inc",
    estimatedCost: 2500,
    lastRestocked: "2024-01-15T10:00:00Z",
  },
  // Add more mock data
];

const mockMetrics: RestockMetrics = {
  totalSuggestions: 8,
  criticalCount: 3,
  estimatedTotalCost: 12500,
  avgRestockTime: 3.5,
};

export function RestockSuggestions() {
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [metrics] = useState<RestockMetrics>(mockMetrics);

  const filteredSuggestions =
    selectedPriority === "all"
      ? mockSuggestions
      : mockSuggestions.filter((s) => s.priority === selectedPriority);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
    >
      {/* Header with Metrics */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-50 rounded-xl">
              <ShoppingCart className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Restock Suggestions
              </h2>
              <p className="text-sm text-gray-500">
                {metrics.criticalCount} critical items need attention
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:border-gray-300 transition-colors"
          >
            <Filter className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricCard
            icon={AlertCircle}
            label="Critical Items"
            value={metrics.criticalCount}
            color="text-red-500 bg-red-50"
          />
          <MetricCard
            icon={Package}
            label="Total Suggestions"
            value={metrics.totalSuggestions}
            color="text-primary-500 bg-primary-50"
          />
          <MetricCard
            icon={DollarSign}
            label="Est. Total Cost"
            value={`$${metrics.estimatedTotalCost.toLocaleString()}`}
            color="text-green-500 bg-green-50"
          />
          <MetricCard
            icon={Clock}
            label="Avg. Restock Time"
            value={`${metrics.avgRestockTime} days`}
            color="text-blue-500 bg-blue-50"
          />
        </div>
      </div>

      {/* Priority Filter */}
      <div className="flex gap-2 p-4 border-b border-gray-100">
        {["all", "critical", "high", "medium", "low"].map((priority) => (
          <motion.button
            key={priority}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedPriority(priority)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              selectedPriority === priority
                ? getPriorityStyle(priority)
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Suggestions List */}
      <div className="divide-y divide-gray-100">
        <AnimatePresence initial={false}>
          {filteredSuggestions.map((suggestion) => (
            <SuggestionItem
              key={suggestion.id}
              suggestion={suggestion}
              isExpanded={expandedItem === suggestion.id}
              onToggle={() =>
                setExpandedItem(
                  expandedItem === suggestion.id ? null : suggestion.id
                )
              }
            />
          ))}
        </AnimatePresence>

        {filteredSuggestions.length === 0 && (
          <div className="p-8 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No restock suggestions found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Helper Components
interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
}

function MetricCard({ icon: Icon, label, value, color }: MetricCardProps) {
  return (
    <div className="p-4 rounded-xl bg-gray-50">
      <div className={`p-2 rounded-lg inline-block ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

interface SuggestionItemProps {
  suggestion: RestockSuggestion;
  isExpanded: boolean;
  onToggle: () => void;
}

function SuggestionItem({
  suggestion,
  isExpanded,
  onToggle,
}: SuggestionItemProps) {
  const handleRestock = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle restock action
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative"
    >
      <div
        onClick={onToggle}
        className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-4">
          {/* Product Image/Icon */}
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
            {suggestion.imageUrl ? (
              <img
                src={suggestion.imageUrl}
                alt={suggestion.productName}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Package className="w-6 h-6 text-gray-400" />
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">
                {suggestion.productName}
              </h3>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityStyle(
                  suggestion.priority
                )}`}
              >
                {suggestion.priority.charAt(0).toUpperCase() +
                  suggestion.priority.slice(1)}
              </span>
            </div>

            <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
              <span>Current Stock: {suggestion.currentStock}</span>
              <span>Recommended: +{suggestion.recommendedQuantity}</span>
            </div>
          </div>

          <ChevronRight
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isExpanded ? "rotate-90" : ""
            }`}
          />
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 pl-16 space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-500">Average Demand</p>
                  <p className="text-lg font-medium text-gray-900">
                    {suggestion.averageDemand} units/month
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-500">Estimated Cost</p>
                  <p className="text-lg font-medium text-gray-900">
                    ${suggestion.estimatedCost.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <p className="text-sm text-gray-500">Supplier</p>
                  <p className="text-sm font-medium text-gray-900">
                    {suggestion.supplier}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRestock}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Place Order
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function getPriorityStyle(priority: string) {
  switch (priority) {
    case "critical":
      return "text-red-600 bg-red-50";
    case "high":
      return "text-orange-600 bg-orange-50";
    case "medium":
      return "text-yellow-600 bg-yellow-50";
    case "low":
      return "text-green-600 bg-green-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
}
