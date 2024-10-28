// components/dashboard/analytics/RevenueChart.tsx
import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Activity,
  LucideIcon,
} from "lucide-react";
import {
  formatCurrency,
  formatNumber,
  calculateGrowth,
} from "@/lib/utils/charts";
import { SalesTrend } from "@/types/analytics";

interface RevenueChartProps {
  data?: SalesTrend[];
  target?: number;
}

export function RevenueChart({ data, target = 100000 }: RevenueChartProps) {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter">(
    "month"
  );
  const [showTooltip, setShowTooltip] = useState(false);

  // Memoized calculations
  const stats = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        totalRevenue: 0,
        averageRevenue: 0,
        growth: 0,
        maxRevenue: 0,
        minRevenue: 0,
        targetAchievement: 0,
      };
    }

    const totalRevenue = data.reduce(
      (sum, item) => sum + (item.revenue || 0),
      0
    );
    const averageRevenue = totalRevenue / data.length;

    const midPoint = Math.floor(data.length / 2);
    const previousPeriodRevenue = data
      .slice(0, midPoint)
      .reduce((sum, item) => sum + (item.revenue || 0), 0);

    const currentPeriodRevenue = data
      .slice(midPoint)
      .reduce((sum, item) => sum + (item.revenue || 0), 0);

    const revenueValues = data.map((d) => d.revenue || 0);
    const maxRevenue = Math.max(...revenueValues);
    const minRevenue = Math.min(...revenueValues);

    const growth = calculateGrowth(previousPeriodRevenue, currentPeriodRevenue);
    const targetAchievement = (totalRevenue / (target * data.length)) * 100;

    return {
      totalRevenue,
      averageRevenue,
      growth,
      maxRevenue,
      minRevenue,
      targetAchievement,
    };
  }, [data, target]);

  const getBarColor = (value: number) => {
    if (value >= target) return "#10B981";
    if (value >= target * 0.8) return "#6366F1";
    return "#F59E0B";
  };

  const timeRangeOptions = [
    { value: "week", label: "Weekly" },
    { value: "month", label: "Monthly" },
    { value: "quarter", label: "Quarterly" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Revenue Analytics
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div
                className={`flex items-center gap-1 text-sm ${
                  stats.growth > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stats.growth > 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {Math.abs(stats.growth)}% vs previous period
              </div>
              <span className="text-sm text-gray-500">
                Target Achievement: {stats.targetAchievement.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex p-1 bg-gray-50 rounded-xl">
              {timeRangeOptions.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTimeRange(option.value as any)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200
                    ${
                      timeRange === option.value
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon={DollarSign}
            trend={stats.growth}
            variant="primary"
          />
          <StatsCard
            title="Average Revenue"
            value={formatCurrency(stats.averageRevenue)}
            icon={Activity}
            variant="secondary"
          />
          <StatsCard
            title="Target Revenue"
            value={formatCurrency(target)}
            icon={Target}
            variant="secondary"
            subtitle={`${stats.targetAchievement.toFixed(1)}% achieved`}
          />
          <StatsCard
            title="Revenue Range"
            value={`${formatCurrency(stats.minRevenue)} - ${formatCurrency(
              stats.maxRevenue
            )}`}
            icon={PieChart}
            variant="secondary"
          />
        </div>

        {/* Chart Section */}
        <div className="h-[400px] mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              onMouseMove={(e) => {
                if (e.activeTooltipIndex !== undefined) {
                  setHoveredBar(e.activeTooltipIndex);
                  setShowTooltip(true);
                }
              }}
              onMouseLeave={() => {
                setHoveredBar(null);
                setShowTooltip(false);
              }}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
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
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;

                  const data = payload[0].payload;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-4 rounded-xl shadow-lg border border-gray-100"
                    >
                      <p className="text-sm font-medium text-gray-900">
                        {data.date}
                      </p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm flex items-center justify-between gap-4">
                          <span className="text-gray-500">Revenue:</span>
                          <span className="font-medium text-primary-600">
                            {formatCurrency(data.revenue)}
                          </span>
                        </p>
                        <p className="text-sm flex items-center justify-between gap-4">
                          <span className="text-gray-500">Target:</span>
                          <span className="font-medium text-gray-600">
                            {formatCurrency(target)}
                          </span>
                        </p>
                        <p className="text-sm flex items-center justify-between gap-4">
                          <span className="text-gray-500">Achievement:</span>
                          <span
                            className={`font-medium ${
                              data.revenue >= target
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {((data.revenue / target) * 100).toFixed(1)}%
                          </span>
                        </p>
                      </div>
                    </motion.div>
                  );
                }}
              />
              <ReferenceLine
                y={target}
                stroke="#10B981"
                strokeDasharray="3 3"
                label={{
                  value: "Target",
                  position: "right",
                  fill: "#10B981",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]} maxBarSize={60}>
                {data?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor(entry.revenue ?? 0)}
                    opacity={hoveredBar === index ? 1 : 0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insights Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <InsightCard
            title="Performance Analysis"
            metrics={[
              {
                label: "Peak Revenue Day",
                value: formatCurrency(stats.maxRevenue),
                trend: "up",
              },
              {
                label: "Target Achievement",
                value: `${stats.targetAchievement.toFixed(1)}%`,
                trend: stats.targetAchievement >= 100 ? "up" : "down",
              },
            ]}
          />
          <InsightCard
            title="Growth Metrics"
            metrics={[
              {
                label: "Revenue Growth",
                value: `${stats.growth}%`,
                trend: stats.growth > 0 ? "up" : "down",
              },
              {
                label: "Average Performance",
                value: formatCurrency(stats.averageRevenue),
                trend: "neutral",
              },
            ]}
          />
          <InsightCard
            title="Target Insights"
            metrics={[
              {
                label: "Days Above Target",
                value: `${
                  (data ?? []).filter((d) => (d.revenue ?? 0) >= target).length
                }/${data?.length ?? 0}`,
                trend: "neutral",
              },
              {
                label: "Target Gap",
                value: formatCurrency(
                  Math.max(0, target * (data?.length ?? 0) - stats.totalRevenue)
                ),
                trend: "down",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

// Helper Components
interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: number;
  variant?: "primary" | "secondary";
  subtitle?: string;
}

function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = "primary",
  subtitle,
}: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`p-4 rounded-xl border ${
        variant === "primary"
          ? "bg-primary-50 border-primary-100"
          : "bg-gray-50 border-gray-100"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-sm ${
            variant === "primary" ? "text-primary-600" : "text-gray-600"
          }`}
        >
          {title}
        </span>
        <Icon
          className={`w-4 h-4 ${
            variant === "primary" ? "text-primary-500" : "text-gray-500"
          }`}
        />
      </div>
      <p className="text-lg font-semibold text-gray-900 mt-1">{value}</p>
      {trend !== undefined && (
        <div
          className={`text-sm mt-1 ${
            trend > 0
              ? "text-green-600"
              : trend < 0
              ? "text-red-600"
              : "text-gray-600"
          }`}
        >
          {trend > 0 ? "+" : ""}
          {trend}%
        </div>
      )}
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </motion.div>
  );
}

interface InsightCardProps {
  title: string;
  metrics: {
    label: string;
    value: string;
    trend: "up" | "down" | "neutral";
  }[];
}

function InsightCard({ title, metrics }: InsightCardProps) {
  return (
    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
      <h4 className="text-sm font-medium text-gray-900">{title}</h4>
      <div className="mt-2 space-y-2">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{metric.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">
                {metric.value}
              </span>
              {metric.trend === "up" && (
                <TrendingUp className="w-4 h-4 text-green-500" />
              )}
              {metric.trend === "down" && (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
