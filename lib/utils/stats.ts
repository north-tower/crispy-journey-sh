// lib/utils/stats.ts
// export const formatCurrency = (value: number): string => {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0,
//   }).format(value);
// };

// export const formatPercentage = (value: number): string => {
//   return new Intl.NumberFormat("en-US", {
//     style: "percent",
//     minimumFractionDigits: 1,
//     maximumFractionDigits: 1,
//   }).format(value / 100);
// };

// export const formatNumber = (value: number): string => {
//   return new Intl.NumberFormat("en-US").format(value);
// };

export const getChangeColor = (trend: "up" | "down" | "neutral") => {
  switch (trend) {
    case "up":
      return "text-green-600 bg-green-50";
    case "down":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

export const getTimeRangeLabel = (timeRange: string): string => {
  switch (timeRange) {
    case "daily":
      return "Today";
    case "weekly":
      return "This Week";
    case "monthly":
      return "This Month";
    case "yearly":
      return "This Year";
    default:
      return timeRange;
  }
};
