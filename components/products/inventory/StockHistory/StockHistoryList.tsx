import { motion, AnimatePresence } from "framer-motion";
import { StockTransaction } from "@/types/stock";
import { ArrowDown, ArrowUp, RefreshCw, Settings, History } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ListProps {
  transactions: StockTransaction[];
  loading: boolean;
}

export function StockHistoryList({ transactions, loading }: ListProps) {
  if (loading) {
    return <StockHistoryLoading />;
  }

  if (transactions.length === 0) {
    return <StockHistoryEmpty />;
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "increase":
        return <ArrowUp className="w-4 h-4 text-green-500" />;
      case "decrease":
        return <ArrowDown className="w-4 h-4 text-red-500" />;
      case "restock":
        return <RefreshCw className="w-4 h-4 text-blue-500" />;
      default:
        return <Settings className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="divide-y divide-gray-100">
      <AnimatePresence initial={false}>
        {transactions.map((transaction) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-50">
                  {getActionIcon(transaction.action)}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {transaction.productName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {transaction.quantity > 0 ? "+" : ""}
                    {transaction.quantity} units
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(transaction.timestamp), {
                    addSuffix: true,
                  })}
                </p>
                <p className="text-sm text-gray-400">{transaction.userName}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function StockHistoryLoading() {
  return (
    <div className="p-8 space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-100 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-100 rounded w-1/3" />
            <div className="h-3 bg-gray-100 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

function StockHistoryEmpty() {
  return (
    <div className="p-8 text-center">
      <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p className="text-gray-500">No stock history available</p>
    </div>
  );
}
