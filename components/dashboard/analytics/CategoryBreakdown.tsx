import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useDashboardStats } from "@/lib/hooks/useDashboardStats";


const COLORS = ["#10B981", "#6366F1", "#F59E0B", "#EC4899", "#8B5CF6", "#14B8A6"];

export function CategoryBreakdown() {
  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'yearly' | 'quarterly'>('monthly');

  const { stats, filterByTimeRange, loading, error } = useDashboardStats();

  const handleTimeRangeChange = async (range: typeof timeRange) => {
    setTimeRange(range);
    await filterByTimeRange(range);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Convert sales to integers locally
  const data = stats?.categorySales.map((category) => ({
    ...category,
    sales: parseInt(category.sales, 10),
  })) || [];

  const renderActiveShape = (props: any) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
    } = props;

    return (
      <g>
        <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="#111827">
          {payload.category}
        </text>
        <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="#6B7280">
          {`${(percent * 100).toFixed(1)}%`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sales by Category</h3>
            <p className="text-sm text-gray-500">
              Distribution of sales across categories
            </p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value as typeof timeRange)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart */}
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              
            {/* <PieChart width={450} height={450}>
          <Pie
            dataKey="sales"
            isAnimationActive={false}
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          />        
          
        </PieChart> */}
          <PieChart width={550} height={400}>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="sales"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(undefined)}
                >
                  {data?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category List */}
          <div className="space-y-4">
            {data.map((category, index) => (
              <motion.div
                key={category.categoryId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                  activeIndex === index ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{category.categoryName}</p>
                    <div className="flex items-center gap-1">
                      {category.sales > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm text-gray-500">
                        {category.sales}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}