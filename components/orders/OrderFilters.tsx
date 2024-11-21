// components/orders/OrderFilters.tsx
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  PackageCheck,
  Truck,
  Calendar,
  CreditCard,
  AlertCircle,
} from "lucide-react";

interface OrderCounts {
  all: number;
  pending: number;
  processing: number;
  ready: number;
  shipped: number;
}

interface OrderFiltersProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  orderCounts: OrderCounts;
  onResetStatus: () => void; // Add a reset handler
}

export function OrderFilters({
  selectedStatus,
  onStatusChange,
  orderCounts,
  onResetStatus,
}: OrderFiltersProps) {
  const statuses = [
    {
      id: "all",
      label: "All Orders",
      icon: Calendar,
      count: orderCounts.all,
    },
    {
      id: "pending",
      label: "Pending",
      icon: Clock,
      count: orderCounts.pending,
    },
    {
      id: "processing",
      label: "Processing",
      icon: CheckCircle2,
      count: orderCounts.processing,
    },
    {
      id: "ready",
      label: "Ready",
      icon: PackageCheck,
      count: orderCounts.ready,
    },
    {
      id: "shipped",
      label: "Shipped",
      icon: Truck,
      count: orderCounts.shipped,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-sm font-medium text-gray-900">Filters</h2>
      </div>

      {/* Status Filters */}
      <div className="p-4">
        <div className="space-y-1">
          {statuses.map((status) => {
            const isSelected = selectedStatus === status.id;
            const Icon = status.icon;

            return (
              <motion.button
                key={status.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onStatusChange(status.id)}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
                  isSelected
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isSelected ? "text-primary-500" : "text-gray-400"
                    }`}
                  />
                  <span className="font-medium">{status.label}</span>
                </div>
                <span
                  className={`text-xs ${
                    isSelected ? "text-primary-600" : "text-gray-400"
                  }`}
                >
                  {status.count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-t border-gray-100 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <CreditCard className="w-4 h-4" />
            <span>Unpaid</span>
          </div>
          <span className="text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full text-xs font-medium">
            3
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <AlertCircle className="w-4 h-4" />
            <span>Attention Needed</span>
          </div>
          <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-full text-xs font-medium">
            2
          </span>
        </div>
      <div className="p-4 border-t border-gray-100 space-y-3">

        <button
          onClick={onResetStatus}
          className="mt-4 w-full text-sm text-center text-gray-500 hover:text-gray-700"
        >
          Reset Status
        </button>

      </div>
      </div>

    </div>
  );
}
