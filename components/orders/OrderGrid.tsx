// components/orders/OrderGrid.tsx
import { motion } from "framer-motion";
import { Order } from "@/types/orders";
import { useRouter } from "next/navigation";
import { Clock, Package } from "lucide-react";

interface OrderGridProps {
  orders: Order[];
}

export function OrderGrid({ orders }: OrderGridProps) {
  const router = useRouter();

  const handleOrderClick = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {orders.map((order) => (
        <motion.div
          key={order.id}
          whileHover={{ y: -2 }}
          onClick={() => handleOrderClick(order.id)}
          className="bg-white p-4 rounded-xl border border-gray-100 hover:border-gray-200 
            hover:shadow-sm transition-all cursor-pointer"
        >
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">
                {order.orderNumber}
              </span>
              <OrderStatus status={order.status} />
            </div>

            {/* Customer Info */}
            <div className="space-y-1">
              <p className="text-sm text-gray-900">{order.customerName}</p>
              <p className="text-sm text-gray-500">{order.customerEmail}</p>
            </div>

            {/* Order Details */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
              <span className="text-sm font-medium text-gray-900">
                ${Number(order.total)}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Shared OrderStatus component
export interface OrderStatusProps {
  status: Order["status"];
}

export function OrderStatus({ status }: OrderStatusProps) {
  const statusStyles = {
    pending: "bg-yellow-50 text-yellow-700",
    processing: "bg-blue-50 text-blue-700",
    ready: "bg-green-50 text-green-700",
    shipped: "bg-purple-50 text-purple-700",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
