// components/reports/performance/PerformanceMetrics.tsx
import { LucideIcon } from "lucide-react";

interface MetricProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: "up" | "down";
}

interface PerformanceMetricsProps {
  metrics: MetricProps[];
}

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  const getTrendColor = (trend: string) => {
    return trend === "up"
      ? "bg-green-50 text-green-600"
      : "bg-red-50 text-red-600";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((metric) => (
        <div
          key={metric.title}
          className="p-6 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
        >
          {/* Header with Icon and Trend */}
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gray-50 rounded-lg">
              <metric.icon className="w-5 h-5 text-gray-400" />
            </div>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(
                metric.trend
              )}`}
            >
              {metric.change}
            </span>
          </div>

          {/* Metric Details */}
          <div>
            <p className="text-sm text-gray-500">{metric.title}</p>
            <p className="text-xl font-semibold text-gray-900 mt-1">
              {metric.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
