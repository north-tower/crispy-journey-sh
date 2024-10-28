import { LucideIcon } from "lucide-react";

export type TrendDirection = "up" | "down";

export interface PerformanceMetric {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: TrendDirection;
}
