// components/dashboard/TimeRangeSelector.tsx
import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronDown } from "lucide-react";
import { TimeRange } from "@/types/dashboard";

interface TimeRangeSelectorProps {
  timeRange: TimeRange;
  showDropdown: boolean;
  onToggle: () => void;
  onChange: (range: TimeRange) => void;
}

const timeRangeOptions = [
  { label: "Today", value: "daily" as TimeRange },
  { label: "This Week", value: "weekly" as TimeRange },
  { label: "This Month", value: "monthly" as TimeRange },
  { label: "This Year", value: "yearly" as TimeRange },
];

export const TimeRangeSelector = memo(function TimeRangeSelector({
  timeRange,
  showDropdown,
  onToggle,
  onChange,
}: TimeRangeSelectorProps) {
  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-primary-100 transition-colors"
      >
        <Calendar className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-700">
          {timeRangeOptions.find((opt) => opt.value === timeRange)?.label}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            showDropdown ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {showDropdown && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-20"
              onClick={onToggle}
            />
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-30"
            >
              {timeRangeOptions.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ x: 4, backgroundColor: "rgb(249 250 251)" }}
                  onClick={() => onChange(option.value)}
                  className={`w-full px-4 py-2 text-sm text-left transition-colors ${
                    timeRange === option.value
                      ? "text-primary-600 bg-primary-50"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {option.label}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});
