import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Bell, Package } from "lucide-react";

interface StockAlert {
  id: string;
  productName: string;
  currentStock: number;
  threshold: number;
  category: string;
  priority: "high" | "medium" | "low";
}

export function LowStockAlerts() {
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLowStockAlerts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:8900/api/products/overview/low-stock-alerts?${selectedPriority !== "all" ? `?priority=${selectedPriority}` : ""}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch low stock alerts");
        }
        const data = await response.json();
        setAlerts(data);
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockAlerts();
  }, [selectedPriority]);

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

  if (loading) {
    return (
      <div className="text-center py-4">
        <span className="text-gray-500">Loading low stock alerts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        <span>{error}</span>
      </div>
    );
  }

  const filteredAlerts =
    selectedPriority === "all"
      ? alerts
      : alerts.filter((alert) => alert.priority === selectedPriority);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
    >
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h2>
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
      </div>

      <div className="divide-y divide-gray-100">
        <AnimatePresence>
          {filteredAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{alert.productName}</h3>
                  <p className="text-sm text-gray-500">
                    {alert.category} - Current Stock: {alert.currentStock}
                  </p>
                </div>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full ${getPriorityColor(alert.priority)}`}>
                  {getPriorityIcon(alert.priority)}
                  <span className="ml-1">{alert.priority}</span>
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredAlerts.length === 0 && (
          <div className="p-8 text-center text-gray-500">No low stock alerts found.</div>
        )}
      </div>
    </motion.div>
  );
}
