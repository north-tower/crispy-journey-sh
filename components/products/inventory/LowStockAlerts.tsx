// components/inventory/LowStockAlerts.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  MinusCircle,
  MoreVertical,
  Package,
  PlusCircle,
  ShoppingCart,
} from "lucide-react";

interface StockAlert {
  id: string;
  productName: string;
  currentStock: number;
  threshold: number;
  category: string;
  priority: "high" | "medium" | "low";
  imageUrl?: string;
}

export function LowStockAlerts() {
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [openAlert, setOpenAlert] = useState<string | null>(null);

  // Mock data - replace with real data
  const alerts: StockAlert[] = [
    {
      id: "1",
      productName: "Wireless Earbuds",
      currentStock: 5,
      threshold: 10,
      category: "Electronics",
      priority: "high",
      imageUrl: "/product-1.jpg",
    },
    {
      id: "2",
      productName: "Smart Watch Pro",
      currentStock: 8,
      threshold: 15,
      category: "Electronics",
      priority: "medium",
      imageUrl: "/product-2.jpg",
    },
    {
      id: "3",
      productName: "Laptop Stand",
      currentStock: 3,
      threshold: 12,
      category: "Accessories",
      priority: "high",
      imageUrl: "/product-3.jpg",
    },
    // Add more mock data as needed
  ];

  const filteredAlerts =
    selectedPriority === "all"
      ? alerts
      : alerts.filter((alert) => alert.priority === selectedPriority);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-100";
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-100";
      default:
        return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="w-4 h-4" />;
      case "medium":
        return <Bell className="w-4 h-4" />;
      case "low":
        return <Package className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-50 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Low Stock Alerts
              </h2>
              <p className="text-sm text-gray-500">
                {filteredAlerts.length} items below threshold
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
          >
            View All
          </motion.button>
        </div>

        {/* Priority Filter */}
        <div className="flex gap-2">
          {["all", "high", "medium", "low"].map((priority) => (
            <motion.button
              key={priority}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPriority(priority)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                selectedPriority === priority
                  ? getPriorityColor(priority)
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="divide-y divide-gray-100">
        <AnimatePresence>
          {filteredAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative"
            >
              <div
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() =>
                  setOpenAlert(openAlert === alert.id ? null : alert.id)
                }
              >
                <div className="flex items-center gap-4">
                  {/* Product Image */}
                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    {alert.imageUrl ? (
                      <img
                        src={alert.imageUrl}
                        alt={alert.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Package className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {alert.productName}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                          alert.priority
                        )}`}
                      >
                        {getPriorityIcon(alert.priority)}
                        <span className="ml-1">
                          {alert.priority.charAt(0).toUpperCase() +
                            alert.priority.slice(1)}
                        </span>
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        Current Stock: {alert.currentStock}
                      </span>
                      <span className="text-sm text-gray-500">
                        Threshold: {alert.threshold}
                      </span>
                    </div>
                  </div>

                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {openAlert === alert.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-4"
                    >
                      {/* Stock Controls */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-4">
                          <button className="p-2 hover:bg-white rounded-lg transition-colors">
                            <MinusCircle className="w-5 h-5 text-gray-500" />
                          </button>
                          <span className="text-lg font-medium text-gray-900">
                            {alert.currentStock}
                          </span>
                          <button className="p-2 hover:bg-white rounded-lg transition-colors">
                            <PlusCircle className="w-5 h-5 text-gray-500" />
                          </button>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Order More
                          </span>
                        </motion.button>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center justify-center flex-1 gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Bell className="w-4 h-4" />
                          <span className="text-sm">Set Alert</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center justify-center flex-1 gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <ArrowRight className="w-4 h-4" />
                          <span className="text-sm">View Details</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredAlerts.length === 0 && (
          <div className="p-8 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No alerts found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
