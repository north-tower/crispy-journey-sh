import { motion } from "framer-motion";
import { RefreshCcw, Search, Filter, RotateCcw } from "lucide-react";

interface ReturnsHeaderProps {
  totalReturns: number;
  onSearch: (query: string) => void;
  onRefresh: () => void;
  searchQuery: string;
}

export function ReturnsHeader({
  totalReturns,
  onSearch,
  onRefresh,
  searchQuery,
}: ReturnsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-red-50 rounded-xl">
          <RotateCcw className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Returns</h1>
          <p className="text-sm text-gray-500">
            {totalReturns} returns need processing
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-initial">
          <input
            type="text"
            placeholder="Search returns..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full sm:w-[300px] pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300
              transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRefresh}
          className="p-2 text-gray-500 hover:text-gray-700 bg-white border border-gray-200 
            rounded-xl hover:border-gray-300 transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-2 text-gray-500 hover:text-gray-700 bg-white border border-gray-200 
            rounded-xl hover:border-gray-300 transition-colors"
        >
          <Filter className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}
