// components/orders/ViewToggle.tsx
import { motion } from "framer-motion";
import { Grid, List } from "lucide-react";

interface ViewToggleProps {
  view: "grid" | "table";
  onChange: (view: "grid" | "table") => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex p-1 bg-gray-50 rounded-xl">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onChange("table")}
        className={`p-2 rounded-lg transition-colors ${
          view === "table"
            ? "bg-white text-primary-600 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <List className="w-4 h-4" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onChange("grid")}
        className={`p-2 rounded-lg transition-colors ${
          view === "grid"
            ? "bg-white text-primary-600 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <Grid className="w-4 h-4" />
      </motion.button>
    </div>
  );
}
