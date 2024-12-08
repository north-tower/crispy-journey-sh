import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ActiveOrdersListProps } from "@/types/orders";
import { OrderTable } from "./OrderTable";
import { OrderGrid } from "./OrderGrid";
import { ViewToggle } from "./ViewToggle";
import { AlertCircle } from "lucide-react";

export function ActiveOrdersList({
  orders,
  loading,
  error,
  onRefresh,
  total,
  page,
  setPage,
  limit,
}: ActiveOrdersListProps & { total: number; page: number; setPage: (page: number) => void; limit: number }) {
  const [view, setView] = useState<"grid" | "table">("table");

  if (loading) {
    return <OrdersLoading view={view} />;
  }

  if (error) {
    return <OrdersError onRetry={onRefresh} />;
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="bg-white rounded-2xl border border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-900">{orders.length}</span>{" "}
            of <span className="font-medium text-gray-900">{total}</span>{" "}
            orders
          </p>
          <ViewToggle view={view} onChange={setView} />
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {orders.length === 0 ? (
          <EmptyState />
        ) : view === "table" ? (
          <OrderTable orders={orders} />
        ) : (
          <OrderGrid orders={orders} />
        )}
      </AnimatePresence>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center p-4 border-t border-gray-100">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className={`px-4 py-2 rounded-lg ${
            page === 1 ? "bg-gray-100 text-gray-400" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
          }`}
        >
          Previous
        </button>
        <p className="text-sm text-gray-500">
          Page <span className="font-medium text-gray-900">{page}</span> of{" "}
          <span className="font-medium text-gray-900">{totalPages}</span>
        </p>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded-lg ${
            page === totalPages ? "bg-gray-100 text-gray-400" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}


// Loading State
function OrdersLoading({ view }: { view: "grid" | "table" }) {
  return (
    <div className="p-4">
      <div
        className={`space-y-4 ${
          view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            : ""
        }`}
      >
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-50 rounded-xl h-24" />
        ))}
      </div>
    </div>
  );
}

// Empty State
function EmptyState() {
  return (
    <div className="p-8 text-center">
      <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p className="text-gray-500">No active orders found</p>
    </div>
  );
}

// Error State
function OrdersError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="p-8 text-center">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
      <p className="text-gray-900 font-medium mb-2">Failed to load orders</p>
      <p className="text-gray-500 mb-4">
        There was an error loading the orders.
      </p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onRetry}
        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
      >
        Try Again
      </motion.button>
    </div>
  );
}
