// components/returns/ReturnsTable.tsx
import { motion } from "framer-motion";
import { ReturnOrder } from "@/types/returns";
import { useRouter } from "next/navigation";

interface ReturnsTableProps {
  returns: ReturnOrder[];
}

export function ReturnsTable({ returns }: ReturnsTableProps) {
  const router = useRouter();

  const handleReturnClick = (id: string) => {
    router.push(`/orders/returns/${id}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-6 gap-4 p-4 border-b border-gray-100">
        <div className="text-xs font-medium text-gray-500 uppercase">Order</div>
        <div className="text-xs font-medium text-gray-500 uppercase">
          Customer
        </div>
        <div className="text-xs font-medium text-gray-500 uppercase">
          Reason
        </div>
        <div className="text-xs font-medium text-gray-500 uppercase">
          Status
        </div>
        <div className="text-xs font-medium text-gray-500 uppercase">
          Amount
        </div>
        <div className="text-xs font-medium text-gray-500 uppercase">Date</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-100">
        {returns.map((returnOrder) => (
          <motion.div
            key={returnOrder.id}
            onClick={() => handleReturnClick(returnOrder.id)}
            whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.5)" }}
            className="grid grid-cols-6 gap-4 p-4 cursor-pointer"
          >
            <div className="text-sm font-medium text-gray-900">
              {returnOrder.orderNumber}
            </div>

            <div>
              <div className="text-sm font-medium text-gray-900">
                {returnOrder.customer.name}
              </div>
              <div className="text-sm text-gray-500">
                {returnOrder.customer.email}
              </div>
            </div>

            <div className="text-sm text-gray-500">
              {returnOrder.returnReason}
            </div>

            <div>
              <ReturnStatus status={returnOrder.status} />
            </div>

            <div className="text-sm font-medium text-gray-900">
              ${returnOrder.amount.toFixed(2)}
            </div>

            <div className="text-sm text-gray-500">
              {new Date(returnOrder.date).toLocaleDateString()}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ReturnStatus({ status }: { status: ReturnOrder["status"] }) {
  const statusStyles = {
    pending: "bg-yellow-50 text-yellow-700",
    approved: "bg-green-50 text-green-700",
    rejected: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
