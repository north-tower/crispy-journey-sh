// lib/utils/charts.ts

/**
 * Currency Formatting
 */
export const formatCurrency = (
  value: number | null | undefined,
  options: Partial<{
    compact: boolean;
    decimals: number;
    currency: string;
  }> = {}
): string => {
  if (value == null) return "---";

  const { compact = false, decimals = 0, currency = "USD" } = options;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    notation: compact ? "compact" : "standard",
    compactDisplay: "short",
  }).format(value);
};

/**
 * Number Formatting
 */
export const formatNumber = (
  value: number | null | undefined,
  options: Partial<{
    compact: boolean;
    decimals: number;
    prefix: string;
    suffix: string;
  }> = {}
): string => {
  if (value == null) return "---";

  const { compact = false, decimals = 0, prefix = "", suffix = "" } = options;

  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    notation: compact ? "compact" : "standard",
    compactDisplay: "short",
  }).format(value);

  return `${prefix}${formatted}${suffix}`;
};

/**
 * Percentage Formatting
 */
export const formatPercentage = (
  value: number | null | undefined,
  options: Partial<{
    decimals: number;
    alwaysShowSign: boolean;
  }> = {}
): string => {
  if (value == null) return "---";

  const { decimals = 1, alwaysShowSign = false } = options;

  const sign = alwaysShowSign && value > 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
};

/**
 * Chart Calculations
 */
export const calculateGrowth = (previous: number, current: number): number => {
  if (previous === 0) return 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
};

export const calculateMovingAverage = (
  data: number[],
  period: number
): number[] => {
  const result: number[] = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    result.push(Number((sum / period).toFixed(2)));
  }
  return result;
};

/**
 * Color Utilities
 */
export const getGradientColors = (trend: "up" | "down" | "neutral") => {
  switch (trend) {
    case "up":
      return ["rgba(16, 185, 129, 0.2)", "rgba(16, 185, 129, 0)"];
    case "down":
      return ["rgba(239, 68, 68, 0.2)", "rgba(239, 68, 68, 0)"];
    default:
      return ["rgba(107, 114, 128, 0.2)", "rgba(107, 114, 128, 0)"];
  }
};

export const getTrendColor = (value: number): string => {
  if (value > 0) return "text-green-600";
  if (value < 0) return "text-red-600";
  return "text-gray-600";
};

/**
 * Date and Time Utilities
 */
export const generateDateLabels = (
  timeRange: "week" | "month" | "quarter"
): string[] => {
  const labels: string[] = [];
  const today = new Date();

  const formatOptions: Record<string, Intl.DateTimeFormatOptions> = {
    week: { weekday: "short" },
    month: { day: "numeric" },
    quarter: { month: "short", day: "numeric" },
  };

  const intervals: Record<string, number> = {
    week: 7,
    month: 30,
    quarter: 90,
  };

  for (let i = intervals[timeRange] - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    labels.push(
      new Intl.DateTimeFormat("en-US", formatOptions[timeRange]).format(date)
    );
  }

  return labels;
};

/**
 * Chart Data Processing
 */
export const processChartData = (
  data: any[],
  options: {
    xKey: string;
    yKey: string;
    sortBy?: "asc" | "desc";
    limit?: number;
  }
) => {
  let processed = [...data];

  if (options.sortBy) {
    processed.sort((a, b) => {
      const comparison = a[options.yKey] - b[options.yKey];
      return options.sortBy === "desc" ? -comparison : comparison;
    });
  }

  if (options.limit) {
    processed = processed.slice(0, options.limit);
  }

  return processed;
};

/**
 * Chart Value Calculations
 */
export const calculateChartStatistics = (data: number[]) => {
  const sorted = [...data].sort((a, b) => a - b);
  const sum = data.reduce((a, b) => a + b, 0);
  const length = data.length;

  return {
    min: sorted[0],
    max: sorted[length - 1],
    average: sum / length,
    median:
      length % 2 === 0
        ? (sorted[length / 2 - 1] + sorted[length / 2]) / 2
        : sorted[Math.floor(length / 2)],
    total: sum,
  };
};

/**
 * Chart Customization
 */
export const chartTheme = {
  colors: {
    primary: "#9333EA",
    secondary: "#6366F1",
    warning: "#F59E0B",
    danger: "#EF4444",
    gray: "#6B7280",
  },
  fonts: {
    base: "var(--font-geist-sans)",
    mono: "var(--font-geist-mono)",
  },
  grid: {
    stroke: "#E5E7EB",
    strokeDasharray: "3 3",
  },
  tooltip: {
    background: "white",
    border: "#E5E7EB",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  },
};

/**
 * Responsiveness Helpers
 */
export const getResponsiveWidth = (containerWidth: number): number => {
  if (containerWidth < 640) return containerWidth - 32; // sm
  if (containerWidth < 768) return containerWidth - 48; // md
  if (containerWidth < 1024) return containerWidth - 64; // lg
  return containerWidth - 80; // xl
};

export const getResponsiveHeight = (containerWidth: number): number => {
  if (containerWidth < 640) return 300; // sm
  if (containerWidth < 768) return 350; // md
  if (containerWidth < 1024) return 400; // lg
  return 450; // xl
};
