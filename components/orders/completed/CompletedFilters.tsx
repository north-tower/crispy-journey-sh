import { Order } from "@/types/orders";
import { motion } from "framer-motion";
import { Calendar, DollarSign, LucideIcon, Star } from "lucide-react";

interface CompletedFiltersProps {
  orders: Order[];
}

export function CompletedFilters({ orders }: CompletedFiltersProps) {
  // Calculate statistics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const avgOrderValue = totalRevenue / orders.length || 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-sm font-medium text-gray-900">Summary</h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Stats */}
        <div className="space-y-3">
          <StatCard
            icon={DollarSign}
            label="Total Revenue"
            value={`$${totalRevenue}`}
          />
          <StatCard
            icon={Star}
            label="Avg. Order Value"
            value={`$${avgOrderValue.toFixed(2)}`}
          />
          <StatCard icon={Calendar} label="Completion Rate" value="98.5%" />
        </div>
      </div>
    </div>
  );
}

// stat card component
function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-lg">
          <Icon className="w-4 h-4 text-gray-400" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-sm font-medium text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
