// components/orders/completed/CompletedOrdersList.tsx
import { Order } from "@/types/orders";
import { ViewToggle } from "../ViewToggle";
import { OrderTable } from "../OrderTable";
import { OrderGrid } from "../OrderGrid";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface CompletedOrdersListProps {
  orders: Order[];
  loading: boolean;
  error: Error | null;
  view: "grid" | "table";
  onViewChange: (view: "grid" | "table") => void;
}

export function CompletedOrdersList({
  orders,
  loading,
  error,
  view,
  onViewChange,
}: CompletedOrdersListProps) {
  if (loading) {
    return <OrdersLoading view={view} />;
  }

  if (error) {
    return (
      <OrdersError
        onRetry={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Showing {orders.length} completed orders
          </span>
          <ViewToggle view={view} onChange={onViewChange} />
        </div>
      </div>

      {view === "table" ? (
        <OrderTable orders={orders} />
      ) : (
        <OrderGrid orders={orders} />
      )}
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
