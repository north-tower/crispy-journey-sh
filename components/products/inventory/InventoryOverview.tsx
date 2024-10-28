// components/inventory/InventoryOverview.tsx
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { Download, Filter } from "lucide-react";

interface InventoryOverviewProps {
  timeframe: "day" | "week" | "month";
}

export function InventoryOverview({ timeframe }: InventoryOverviewProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Mock data - replace with real data
  const data = [
    { name: "Electronics", inStock: 120, lowStock: 15, outOfStock: 5 },
    { name: "Clothing", inStock: 85, lowStock: 20, outOfStock: 8 },
    { name: "Books", inStock: 45, lowStock: 10, outOfStock: 2 },
    { name: "Home", inStock: 95, lowStock: 12, outOfStock: 4 },
    { name: "Sports", inStock: 60, lowStock: 8, outOfStock: 3 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 p-6"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Inventory Overview
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Stock levels by category
            </p>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
            >
              <Filter className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
            >
              <Download className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                        <p className="text-sm font-medium text-gray-900 mb-2">
                          {label}
                        </p>
                        {payload.map((item: any) => (
                          <div
                            key={item.name}
                            className="flex items-center justify-between gap-4 text-sm"
                          >
                            <span className="text-gray-500">{item.name}:</span>
                            <span
                              className="font-medium"
                              style={{ color: item.fill }}
                            >
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                content={({ payload }) => (
                  <div className="flex justify-center gap-6">
                    {payload?.map((entry: any) => (
                      <div
                        key={entry.value}
                        className="flex items-center gap-2"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm text-gray-600">
                          {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              />
              <Bar dataKey="inStock" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lowStock" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="outOfStock" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <SummaryCard
            title="In Stock"
            value={data.reduce((acc, curr) => acc + curr.inStock, 0)}
            color="bg-green-50 text-green-600"
          />
          <SummaryCard
            title="Low Stock"
            value={data.reduce((acc, curr) => acc + curr.lowStock, 0)}
            color="bg-yellow-50 text-yellow-600"
          />
          <SummaryCard
            title="Out of Stock"
            value={data.reduce((acc, curr) => acc + curr.outOfStock, 0)}
            color="bg-red-50 text-red-600"
          />
        </div>
      </div>
    </motion.div>
  );
}

function SummaryCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-gray-50">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-lg font-semibold mt-1 ${color}`}>{value}</p>
    </div>
  );
}
