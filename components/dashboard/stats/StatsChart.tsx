import { TrendDirection } from "@/types/dashboard";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface StatsChartProps {
  data: number[];
  trend: TrendDirection;
}

export function StatsChart({ data, trend }: StatsChartProps) {
  const chartData = data.map((value, index) => ({ value, index }));

  const getGradientColors = () => {
    switch (trend) {
      case "up":
        return ["#10B981", "#ECFDF5"];
      case "down":
        return ["#EF4444", "#FEF2F2"];
      default:
        return ["#6B7280", "#F9FAFB"];
    }
  };

  const [strokeColor, gradientTo] = getGradientColors();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id={`gradient-${trend}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.2} />
            <stop offset="100%" stopColor={gradientTo} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={strokeColor}
          strokeWidth={2}
          fill={`url(#gradient-${trend})`}
          fillOpacity={1}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
