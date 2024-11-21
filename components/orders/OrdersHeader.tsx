// components/orders/OrdersHeader.tsx
import { motion } from "framer-motion";
import { Search, RefreshCcw, Filter, Package } from "lucide-react";

interface OrdersHeaderProps {
  title: string;
  totalOrders: number;
  onSearch: (query: string) => void;
  searchQuery: string;
  onRefresh: () => void;
  toggleFilterModal: () => void;

}

export function OrdersHeader({
  title,
  totalOrders,
  onSearch,
  searchQuery,
  onRefresh,
  toggleFilterModal
}: OrdersHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary-50 rounded-xl">
            <Package className="w-5 h-5 text-primary-500" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500">
              {totalOrders} orders need attention
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-[300px] bg-white border border-gray-200 rounded-full 
                focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300
                transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          {/* Action Buttons */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRefresh}
            className="p-2 text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
          </motion.button>

          <motion.button
            onClick={toggleFilterModal}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-2 text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
          >
            <Filter className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
