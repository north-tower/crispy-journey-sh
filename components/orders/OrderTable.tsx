// components/orders/OrderTable.tsx
import { motion } from "framer-motion";
import { Order } from "@/types/orders";
import { useRouter } from "next/navigation";
import { OrderStatus } from "./OrderGrid";

interface OrderTableProps {
  orders: Order[];
}

export function OrderTable({ orders }: OrderTableProps) {
  const router = useRouter();

  const handleOrderClick = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((order) => (
            <motion.tr
              key={order.id}
              onClick={() => handleOrderClick(order.id)}
              whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.5)" }}
              className="cursor-pointer"
            >
             <td className="px-6 py-4 whitespace-nowrap">
              <span className="text-sm font-medium text-gray-900">
                {order.id.slice(0, 5)}
              </span>
            </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm text-gray-900">
                    {order.user.firstName} {order.user.lastName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.user.email}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <OrderStatus status={order.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-medium text-gray-900">
                  KES{order.total}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
