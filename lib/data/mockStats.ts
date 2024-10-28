import { DashboardStats } from "@/types/dashboard";

const generateChartData = (
  points: number = 12,
  trend: "up" | "down" | "neutral" = "up"
) => {
  const data: number[] = [];
  let current = 50;

  for (let i = 0; i < points; i++) {
    if (trend === "up") {
      current += Math.random() * 10;
    } else if (trend === "down") {
      current -= Math.random() * 10;
    } else {
      current += Math.random() * 6 - 3;
    }
    data.push(Math.max(0, current));
  }

  return data;
};

export const mockStats: DashboardStats = {
  totalSales: {
    id: "total-sales",
    title: "Total Sales",
    value: 84232,
    formattedValue: "$84,232",
    change: {
      value: 12392,
      percentage: 12.5,
      trend: "up",
      timeRange: "monthly",
    },
    chart: generateChartData(12, "up"),
    color: "primary",
  },
  orderCount: {
    id: "order-count",
    title: "Orders",
    value: 1234,
    formattedValue: "1,234",
    change: {
      value: 123,
      percentage: 8.2,
      trend: "up",
      timeRange: "monthly",
    },
    chart: generateChartData(12, "up"),
    color: "success",
  },
  revenueMetrics: {
    id: "revenue-metrics",
    title: "Revenue Growth",
    value: 23.5,
    formattedValue: "23.5%",
    change: {
      value: 4.2,
      percentage: 15.3,
      trend: "up",
      timeRange: "monthly",
    },
    chart: generateChartData(12, "up"),
    color: "info",
  },
  averageOrderValue: {
    id: "avg-order-value",
    title: "Avg. Order Value",
    value: 68.2,
    formattedValue: "$68.20",
    change: {
      value: -2.3,
      percentage: -3.2,
      trend: "down",
      timeRange: "monthly",
    },
    chart: generateChartData(12, "down"),
    color: "primary",
  },
  totalProducts: {
    id: "total-products",
    title: "Total Products",
    value: 856,
    formattedValue: "856",
    change: {
      value: 32,
      percentage: 3.8,
      trend: "up",
      timeRange: "monthly",
    },
    chart: generateChartData(12, "up"),
    color: "success",
  },
  stockAlerts: {
    id: "stock-alerts",
    title: "Low Stock Items",
    value: 12,
    formattedValue: "12",
    change: {
      value: 3,
      percentage: 25,
      trend: "up",
      timeRange: "monthly",
    },
    chart: generateChartData(12, "up"),
    color: "warning",
  },
  customerSatisfaction: {
    id: "customer-satisfaction",
    title: "Customer Satisfaction",
    value: 94.8,
    formattedValue: "94.8%",
    change: {
      value: 1.2,
      percentage: 1.3,
      trend: "up",
      timeRange: "monthly",
    },
    chart: generateChartData(12, "up"),
    color: "error",
  },
};
