// components/orders/OrderItem/OrderActions.tsx
import { Order } from "@/types/orders";
import { motion } from "framer-motion";
import { Printer, Download, MoreVertical, AlertCircle } from "lucide-react";
import { useState } from "react";

interface OrderActionsProps {
  order: Order;
}

export function OrderActions({ order }: OrderActionsProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-4 py-2 text-primary-600 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors"
      >
        <Printer className="w-4 h-4" />
        <span className="text-sm font-medium">Print Order</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="p-2 text-gray-500 hover:text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
      >
        <Download className="w-4 h-4" />
      </motion.button>

      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowActions(!showActions)}
          className="p-2 text-gray-500 hover:text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <MoreVertical className="w-4 h-4" />
        </motion.button>

        {showActions && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10"
          >
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
              Mark as Complete
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
              Send Reminder
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
              Cancel Order
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
