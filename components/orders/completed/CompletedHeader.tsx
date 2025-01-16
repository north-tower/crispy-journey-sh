// /components/orders/completed/CompletedHeader.tsx
import { motion } from "framer-motion";
import { Search, RefreshCcw, CheckSquare } from "lucide-react";

interface CompletedHeaderProps {
  totalOrders: number;
  onSearch: (query: string) => void;
  searchQuery: string;
  onRefresh: () => void;
  dateFilter: "week" | "month" | "year";
  onDateFilterChange: (filter: "week" | "month" | "year") => void;
}

export function CompletedHeader({
  totalOrders,
  onSearch,
  searchQuery,
  onRefresh,
  dateFilter,
  onDateFilterChange,
}: CompletedHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-50 rounded-xl">
            <CheckSquare className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Completed Orders
            </h1>
            <p className="text-sm text-gray-500">
              {totalOrders} orders completed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Filter */}
          <div className="flex p-1 bg-gray-50 rounded-xl">
            {(["week", "month", "year"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => onDateFilterChange(filter)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  dateFilter === filter
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 bg-white border border-gray-200 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300
                transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          {/* Refresh */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRefresh}
            className="p-2 text-gray-500 hover:text-gray-700 bg-white border border-gray-200 
              rounded-xl hover:border-gray-300 transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}