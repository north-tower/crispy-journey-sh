// components/pricing/PricingOverview/PriceDistribution.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";

export function PriceDistribution() {
  const data = [
    { range: "$0-25", count: 45, percentage: 15 },
    { range: "$26-50", count: 80, percentage: 26 },
    { range: "$51-100", count: 95, percentage: 31 },
    { range: "$101-200", count: 50, percentage: 16 },
    { range: "$201-500", count: 25, percentage: 8 },
    { range: "$500+", count: 12, percentage: 4 },
  ];

  const getBarColor = (value: number) => {
    const colors = [
      "#10B981", // Primary
      "#34D399",
      "#6EE7B7",
      "#A7F3D0",
      "#D1FAE5",
      "#ECFDF5",
    ];
    // Use different shades based on the percentage
    return colors[Math.floor((value / 35) * colors.length)] || colors[0];
  };

  return (
    <div className="space-y-6">
      {/* Distribution Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-gray-50">
          <div className="text-sm text-gray-500 mb-1">Most Common Range</div>
          <p className="text-lg font-semibold text-gray-900">$51-100</p>
          <p className="text-sm text-primary-600">31% of products</p>
        </div>
        <div className="p-4 rounded-xl bg-gray-50">
          <div className="text-sm text-gray-500 mb-1">Median Price Range</div>
          <p className="text-lg font-semibold text-gray-900">$26-50</p>
          <p className="text-sm text-primary-600">26% of products</p>
        </div>
        <div className="p-4 rounded-xl bg-gray-50">
          <div className="text-sm text-gray-500 mb-1">Price Spread</div>
          <p className="text-lg font-semibold text-gray-900">High</p>
          <p className="text-sm text-primary-600">6 distinct ranges</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="range"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={{ stroke: "#E5E7EB" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={{ stroke: "#E5E7EB" }}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload;

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-4 rounded-lg shadow-lg border border-gray-100"
                  >
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      Price Range: {label}
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">
                        Products:{" "}
                        <span className="font-medium text-gray-900">
                          {data.count}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Percentage:{" "}
                        <span className="font-medium text-primary-600">
                          {data.percentage}%
                        </span>
                      </p>
                    </div>
                  </motion.div>
                );
              }}
            />
            <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.percentage)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="bg-primary-50 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg">
            <Info className="w-4 h-4 text-primary-500" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-primary-900 mb-1">
              Distribution Insights
            </h4>
            <p className="text-sm text-primary-700">
              Most products are concentrated in the mid-range price brackets,
              suggesting a balanced pricing strategy. Consider exploring
              opportunities in higher price segments where competition might be
              lower.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
