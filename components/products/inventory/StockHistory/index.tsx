import { useEffect } from "react";
import { motion } from "framer-motion";
import { History } from "lucide-react";
import { useStockHistory } from "@/lib/hooks/useStockHistory";
import { StockHistoryFilters } from "./StockHistoryFilters";
import { StockHistoryList } from "./StockHistoryList";
export function StockHistory() {
  const { transactions, loading, filters, setFilters, fetchTransactions } =
    useStockHistory();

  useEffect(() => {
    fetchTransactions(filters);
  }, [fetchTransactions, filters]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100"
    >
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 rounded-xl">
            <History className="w-5 h-5 text-primary-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Stock History
            </h2>
            <p className="text-sm text-gray-500">
              Recent stock movements and adjustments
            </p>
          </div>
        </div>
        <StockHistoryFilters
          filters={filters}
          onFilterChange={setFilters}
          className="mt-4"
        />
      </div>

      <StockHistoryList transactions={transactions} loading={loading} />
    </motion.div>
  );
}
