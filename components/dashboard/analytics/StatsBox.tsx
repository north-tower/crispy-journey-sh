import {
  DollarSign,
  LucideIcon,
  RefreshCcw,
  ShoppingCart,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/utils";

interface StatsBoxProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  subtitle?: string;
  loading?: boolean;
  color?: "default" | "primary" | "success" | "warning" | "danger";
  onClick?: () => void;
  className?: string;
}

export function StatsBox({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  loading = false,
  color = "default",
  onClick,
  className,
}: StatsBoxProps) {
  // Color variants
  const colorVariants = {
    default: {
      background: "bg-gray-50 hover:bg-gray-100/80",
      border: "border-gray-100",
      icon: "text-gray-500",
      hover: "hover:border-gray-200",
    },
    primary: {
      background: "bg-primary-50 hover:bg-primary-100/80",
      border: "border-primary-100",
      icon: "text-primary-500",
      hover: "hover:border-primary-200",
    },
    success: {
      background: "bg-green-50 hover:bg-green-100/80",
      border: "border-green-100",
      icon: "text-green-500",
      hover: "hover:border-green-200",
    },
    warning: {
      background: "bg-yellow-50 hover:bg-yellow-100/80",
      border: "border-yellow-100",
      icon: "text-yellow-500",
      hover: "hover:border-yellow-200",
    },
    danger: {
      background: "bg-red-50 hover:bg-red-100/80",
      border: "border-red-100",
      icon: "text-red-500",
      hover: "hover:border-red-200",
    },
  };

  const selectedColor = colorVariants[color];

  // Trend color and icon
  const getTrendColor = (value: number) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-600";
  };

  const baseClasses = cn(
    "relative p-4 rounded-xl border transition-all duration-200",
    selectedColor.background,
    selectedColor.border,
    selectedColor.hover,
    onClick && "cursor-pointer",
    className
  );

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(baseClasses, "animate-pulse")}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-6 w-6 rounded-full bg-gray-200" />
        </div>
        <div className="h-6 w-32 bg-gray-200 rounded mb-1" />
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={
        onClick ? { y: -2, transition: { duration: 0.2 } } : undefined
      }
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={baseClasses}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-600 font-medium">{title}</span>
        <div className={cn("p-2 rounded-lg", selectedColor.background)}>
          <Icon className={cn("w-4 h-4", selectedColor.icon)} />
        </div>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-semibold text-gray-900">{value}</span>
        {trend !== undefined && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex items-center gap-1 text-sm",
              getTrendColor(trend)
            )}
          >
            {trend > 0 ? "+" : ""}
            {trend}%
          </motion.div>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}

      {/* Hover Effect Overlay */}
      {onClick && (
        <motion.div
          initial={false}
          className="absolute inset-0 rounded-xl bg-black opacity-0 hover:opacity-5 transition-opacity"
        />
      )}
    </motion.div>
  );
}

// Example usage of StatsBox variants
export function StatsBoxGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsBox
        title="Total Revenue"
        value="$24,567"
        icon={DollarSign}
        trend={12.5}
        color="primary"
      />
      <StatsBox
        title="Orders"
        value="1,234"
        icon={ShoppingCart}
        trend={-5.2}
        color="warning"
      />
      <StatsBox
        title="Customers"
        value="892"
        icon={Users}
        trend={8.1}
        color="success"
      />
      <StatsBox
        title="Refunds"
        value="23"
        icon={RefreshCcw}
        trend={2.3}
        color="danger"
      />
    </div>
  );
}
