// components/dashboard/analytics/SalesTrendChart.tsx
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { SalesTrend, TimeFrame } from "@/types/analytics";
import { formatCurrency, formatNumber } from "@/lib/utils/charts";

interface SalesTrendChartProps {
  data: SalesTrend[];
  timeFrame: TimeFrame;
  onTimeFrameChange: (timeFrame: TimeFrame) => void;
}

export function SalesTrendChart({
  data,
  timeFrame,
  onTimeFrameChange,
}: SalesTrendChartProps) {
  const [activeMetric, setActiveMetric] = useState<
    "sales" | "revenue" | "orders"
  >("revenue");
  const [hoveredData, setHoveredData] = useState<any>(null);

  const metrics = [
    { key: "revenue", label: "Revenue", color: "#10B981" },
    { key: "sales", label: "Sales", color: "#6366F1" },
    { key: "orders", label: "Orders", color: "#F59E0B" },
  ];

  const timeFrames: { value: TimeFrame; label: string }[] = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Sales Analytics
            </h3>
            <p className="text-sm text-gray-500">
              Detailed breakdown of sales performance
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Metric Selector */}
            <div className="flex p-1 bg-gray-50 rounded-xl">
              {metrics.map((metric) => (
                <button
                  key={metric.key}
                  onClick={() => setActiveMetric(metric.key as any)}
                  className={`
                    px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200
                    ${
                      activeMetric === metric.key
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }
                  `}
                >
                  {metric.label}
                </button>
              ))}
            </div>

            {/* Time Frame Selector */}
            <div className="flex p-1 bg-gray-50 rounded-xl">
              {timeFrames.map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => onTimeFrameChange(tf.value)}
                  className={`
                    px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200
                    ${
                      timeFrame === tf.value
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }
                  `}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              onMouseMove={(e) => {
                if (e.activePayload) {
                  setHoveredData(e.activePayload[0].payload);
                }
              }}
              onMouseLeave={() => setHoveredData(null)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={{ stroke: "#E5E7EB" }}
              />
              <YAxis
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={{ stroke: "#E5E7EB" }}
                tickFormatter={(value) =>
                  activeMetric === "revenue"
                    ? formatCurrency(value)
                    : formatNumber(value)
                }
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;

                  return (
                    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {payload[0].payload.date}
                      </p>
                      <div className="mt-2 space-y-1">
                        {metrics.map((metric) => (
                          <p
                            key={metric.key}
                            className="text-sm flex items-center justify-between gap-4"
                          >
                            <span className="text-gray-500">
                              {metric.label}:
                            </span>
                            <span
                              className="font-medium"
                              style={{ color: metric.color }}
                            >
                              {metric.key === "revenue"
                                ? formatCurrency(payload[0].payload[metric.key])
                                : formatNumber(payload[0].payload[metric.key])}
                            </span>
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                }}
              />
              <Legend />
              {metrics.map((metric) => (
                <Line
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.key}
                  stroke={metric.color}
                  strokeWidth={activeMetric === metric.key ? 3 : 1.5}
                  dot={false}
                  activeDot={{ r: 8, fill: metric.color }}
                  opacity={activeMetric === metric.key ? 1 : 0.3}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.key}
              className="p-4 rounded-xl bg-gray-50 border border-gray-100"
            >
              <p className="text-sm text-gray-500">{metric.label}</p>
              <p
                className="text-lg font-semibold mt-1"
                style={{ color: metric.color }}
              >
                {metric.key === "revenue"
                  ? formatCurrency(
                      hoveredData?.[metric.key] ??
                        data[data.length - 1][metric.key]
                    )
                  : formatNumber(
                      hoveredData?.[metric.key as keyof SalesTrend] ??
                        data[data.length - 1][metric.key as keyof SalesTrend]
                    )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
