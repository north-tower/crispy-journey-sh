import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ArrowDown, Minus, MoreHorizontal } from "lucide-react";
import { StatsChart } from "./StatsChart";
import { cn } from "@/lib/utils/utils";
import { StatData } from "@/types/dashboard";

interface StatsCardProps {
  data: StatData;
  className?: string;
}

export function StatsCard({ data, className }: StatsCardProps) {
  const [showOptions, setShowOptions] = useState(false);

  const getTrendIcon = () => {
    switch (data.change.trend) {
      case "up":
        return <ArrowUp className="w-4 h-4" />;
      case "down":
        return <ArrowDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getStatusColor = () => {
    switch (data.change.trend) {
      case "up":
        return "text-green-600 bg-green-50";
      case "down":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={cn(
        "relative group p-6 bg-white rounded-2xl border border-gray-100",
        "hover:shadow-lg hover:border-primary-100 transition-all duration-300",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {data.icon && (
              <div
                className={cn(
                  "p-2 rounded-xl",
                  data.color === "primary" && "bg-primary-50 text-primary-600",
                  data.color === "success" && "bg-green-50 text-green-600",
                  data.color === "warning" && "bg-yellow-50 text-yellow-600",
                  data.color === "error" && "bg-red-50 text-red-600",
                  data.color === "info" && "bg-blue-50 text-blue-600"
                )}
              >
                <data.icon className="w-5 h-5" />
              </div>
            )}
            <h3 className="text-sm font-medium text-gray-500">{data.title}</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-gray-900">
              {data.formattedValue || data.value}
            </span>
            <div
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                getStatusColor()
              )}
            >
              {getTrendIcon()}
              {data.change.percentage}%
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowOptions(!showOptions)}
          className="p-2 rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-4 top-12 w-48 bg-white rounded-xl shadow-lg border border-gray-100 p-2 z-10"
            >
              <div className="space-y-1">
                {["Daily", "Weekly", "Monthly", "Yearly"].map((range) => (
                  <button
                    key={range}
                    className="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg text-left"
                  >
                    View {range}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {data.chart && (
        <div className="mt-4 h-16">
          <StatsChart data={data.chart} trend={data.change.trend} />
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-50">
        <p className="text-sm text-gray-500">
          vs. previous {data.change.timeRange}
        </p>
      </div>
    </motion.div>
  );
}
