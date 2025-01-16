// components/reports/performance/PerformanceCharts.tsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function PerformanceCharts() {
  const satisfactionData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Satisfaction",
        data: [4.2, 4.4, 4.3, 4.5, 4.6, 4.8],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const processingData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Processing Time (days)",
        data: [1.8, 1.6, 1.5, 1.4, 1.3, 1.2],
        borderColor: "#6366F1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "white",
        titleColor: "#111827",
        bodyColor: "#6B7280",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          family: "Inter",
        },
        titleFont: {
          family: "Inter",
          weight: 600,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "Inter",
          },
        },
      },
      y: {
        grid: {
          color: "#E5E7EB",
        },
        ticks: {
          font: {
            family: "Inter",
          },
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Satisfaction Trend */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Customer Satisfaction Trend
        </h3>
        <div className="h-[300px]">
          <Line data={satisfactionData} options={chartOptions} />
        </div>
      </div>

      {/* Processing Time */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Processing Time Analysis
        </h3>
        <div className="h-[300px]">
          <Line data={processingData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
