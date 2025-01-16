import { useState, useEffect, useMemo } from "react";
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
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,

  PieChart,
  Activity,
} from "lucide-react";
import { useDashboardStats } from "@/lib/hooks/useDashboardStats";
import { formatCurrency, calculateGrowth } from "@/lib/utils/charts";


interface RevenueChartProps {
  target?: number;
}

export function RevenueChart({ target = 100000 }: RevenueChartProps) {
  const { stats, loading, error, filterByTimeRange } = useDashboardStats();
  const [timeRange, setTimeRange] = useState<"weekly" | "monthly" | "quarterly">("monthly");
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [ setShowTooltip] = useState(false);

  // Fetch data based on the selected time range
  useEffect(() => {
    filterByTimeRange(timeRange);
  }, [timeRange, filterByTimeRange]);

  // Memoized calculations for stats
  const statsData = useMemo(() => {
    const salesTrends = stats?.salesTrends || [];

    if (salesTrends.length === 0) {
      return {
        totalRevenue: 0,
        averageRevenue: 0,
        growth: 0,
        maxRevenue: 0,
        minRevenue: 0,
        targetAchievement: 0,
      };
    }

    const totalRevenue = salesTrends.reduce(
      (sum, item) => sum + parseFloat(String(item.sales || "0")),
      0
    );

    const averageRevenue = totalRevenue / salesTrends.length;

    const midPoint = Math.floor(salesTrends.length / 2);

    const previousPeriodRevenue = salesTrends
    .slice(0, midPoint)
    .reduce((sum, item) => sum + parseFloat(String(item.sales || "0")), 0);
  
      const currentPeriodRevenue = salesTrends
      .slice(midPoint)
      .reduce((sum, item) => sum + parseFloat(String(item.sales || "0")), 0);
    
      const revenueValues = salesTrends.map((d) => parseFloat(String(d.sales || "0")));
    const maxRevenue = Math.max(...revenueValues);
    const minRevenue = Math.min(...revenueValues);

    const growth = calculateGrowth(previousPeriodRevenue, currentPeriodRevenue);
    const targetAchievement = (totalRevenue / (target * salesTrends.length)) * 100;

    return {
      totalRevenue,
      averageRevenue,
      growth,
      maxRevenue,
      minRevenue,
      targetAchievement,
    };
  }, [stats, target]);

  

  // Dynamic bar colors based on the target
  const getBarColor = (revenue) => {
    if (revenue > 200) {
      return "#4CAF50"; // Green for high revenue
    }
    return "#FFC107"; // Yellow for low revenue
  };
  

  // Time Range Options
  const timeRangeOptions = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
  ];
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !stats?.salesTrends) {
    return <div>Failed to load revenue data</div>;
  }
  const chartData = stats.salesTrends.map((trend) => ({
    date: new Date(trend.date).toLocaleDateString(), // Formats the date
    revenue: parseFloat(String(trend.sales || "0")),
  }));
  
  
  
  console.log("BarChart Data:", chartData);
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
                  statsData.growth > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {statsData.growth > 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {Math.abs(statsData.growth)}% vs previous period
              </div>
             
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
                  onClick={() => setTimeRange(option.value)}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(statsData.totalRevenue)}
            icon={DollarSign}
            trend={statsData.growth}
            variant="primary"
          />
          <StatsCard
            title="Average Revenue"
            value={formatCurrency(statsData.averageRevenue)}
            icon={Activity}
            variant="secondary"
          />
         
          <StatsCard
            title="Revenue Range"
            value={`${formatCurrency(statsData.minRevenue)} - ${formatCurrency(
              statsData.maxRevenue
            )}`}
            icon={PieChart}
            variant="secondary"
          />
        </div>


       {/* Chart Section */}
<div className="h-[400px] mt-6">
  <ResponsiveContainer width="100%" height="100%">
  <BarChart
  width={600}
  height={400}
              data={chartData}
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

                  const chartData = payload[0].payload;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-4 rounded-xl shadow-lg border border-gray-100"
                    >
                      <p className="text-sm font-medium text-gray-900">
                        {chartData.date}
                      </p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm flex items-center justify-between gap-4">
                          <span className="text-gray-500">Revenue:</span>
                          <span className="font-medium text-primary-600">
                            {formatCurrency(chartData.revenue)}
                          </span>
                        </p>
                       
                        <p className="text-sm flex items-center justify-between gap-4">
                          <span className="text-gray-500">Achievement:</span>
                          <span
                            className={`font-medium ${
                              chartData.revenue >= target
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {((chartData.revenue / target) * 100).toFixed(1)}%
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
                {chartData?.map((entry, index) => (
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

      </div>
    </div>
  );
}

// Helper Components (StatsCard, InsightCard)
interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
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
