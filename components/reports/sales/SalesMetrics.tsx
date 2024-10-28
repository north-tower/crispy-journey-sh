// components/reports/sales/SalesMetrics.tsx
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface MetricProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: "up" | "down";
}

export function SalesMetrics({ metrics }: { metrics: MetricProps[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2 }}
          className="p-6 bg-white rounded-xl border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gray-50 rounded-lg">
              <metric.icon className="w-5 h-5 text-gray-400" />
            </div>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                metric.trend === "up"
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {metric.change}
            </span>
          </div>
          <p className="text-sm text-gray-500">{metric.title}</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">
            {metric.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
