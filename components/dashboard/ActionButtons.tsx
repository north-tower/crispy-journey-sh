// components/dashboard/ActionButtons.tsx
import { memo } from "react";
import { motion } from "framer-motion";
import { Download, Filter, RefreshCcw } from "lucide-react";

interface ActionButtonsProps {
  onRefresh: () => void;
  loading: boolean;
}

export const ActionButtons = memo(function ActionButtons({
  onRefresh,
  loading,
}: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onRefresh}
        disabled={loading}
        className="p-2 text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-primary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="p-2 text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-primary-100 transition-colors"
      >
        <Download className="w-4 h-4" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="p-2 text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-primary-100 transition-colors"
      >
        <Filter className="w-4 h-4" />
      </motion.button>
    </div>
  );
});
