// components/inventory/StockHistory/StockHistoryFilters.tsx
import { motion } from "framer-motion";
import { StockHistoryFilters as Filters, StockAction } from "@/types/stock";

interface FiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  className?: string;
}

export function StockHistoryFilters({
  filters,
  onFilterChange,
  className = "",
}: FiltersProps) {
  const actionTypes: StockAction[] = [
    "increase",
    "decrease",
    "restock",
    "adjustment",
  ];

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {actionTypes.map((action) => (
        <motion.button
          key={action}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() =>
            onFilterChange({
              ...filters,
              action: filters.action === action ? undefined : action,
            })
          }
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            filters.action === action
              ? "bg-primary-50 text-primary-600"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          {action.charAt(0).toUpperCase() + action.slice(1)}
        </motion.button>
      ))}
    </div>
  );
}
