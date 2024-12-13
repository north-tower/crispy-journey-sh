import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";

interface MarginChartProps {
  timeframe: "7d" | "30d" | "90d";
}

export function MarginChart({ timeframe }: MarginChartProps) {
  // Generate mock data based on timeframe
  const data = useMemo(() => {
    const points = timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : 90;
    return generateMarginData(points);
  }, [timeframe]);

  const averageMargin = useMemo(() => {
    return data.reduce((sum, item) => sum + item.margin, 0) / data.length;
  }, [data]);

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
          width={600}
          height={400}
        >
          <defs>
            <linearGradient id="marginGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5E7EB"
          />
          <XAxis
            dataKey="date"
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

              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-3 rounded-lg shadow-lg border border-gray-100"
                >
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {label}
                  </p>
                  <p className="text-sm text-gray-500">
                    Margin:{" "}
                    <span className="font-medium text-primary-600">
                      {payload[0].value}%
                    </span>
                  </p>
                </motion.div>
              );
            }}
          />
          <ReferenceLine
            y={averageMargin}
            stroke="#10B981"
            strokeDasharray="3 3"
            label={{
              value: `Avg: ${averageMargin.toFixed(1)}%`,
              position: "right",
              fill: "#10B981",
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="margin"
            stroke="#10B981"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: "#10B981" }}
            fill="url(#marginGradient)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Helper function to generate mock data
function generateMarginData(points: number) {
  const data = [];
  const today = new Date();
  let margin = 30; // Starting margin

  for (let i = points - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Add some random variation to the margin
    margin += (Math.random() - 0.5) * 4;
    margin = Math.max(15, Math.min(45, margin)); // Keep margin between 15% and 45%

    data.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      margin: Number(margin.toFixed(1)),
    });
  }

  return data;
}
