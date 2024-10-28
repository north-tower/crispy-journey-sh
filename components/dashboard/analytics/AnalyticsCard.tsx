import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
  children: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function AnalyticsCard({
  title,
  subtitle,
  icon: Icon,
  className = "",
  children,
  action,
}: AnalyticsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl border border-gray-100 p-6 ${className}`}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              {Icon && (
                <div className="p-2 rounded-lg bg-gray-50">
                  <Icon className="w-5 h-5 text-gray-500" />
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
          {action && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.onClick}
              className="px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 
                bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
            >
              {action.label}
            </motion.button>
          )}
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </motion.div>
  );
}
