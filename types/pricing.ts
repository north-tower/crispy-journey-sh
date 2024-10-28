// types/pricing.ts
export type PricingStrategy = "fixed" | "dynamic" | "tiered" | "promotional";
export type PriceChangeStatus = "scheduled" | "active" | "expired";
export type PricingSuggestionPriority = "high" | "medium" | "low";

export interface PriceChange {
  id: string;
  productId: string;
  oldPrice: number;
  newPrice: number;
  changePercentage: number;
  startDate: string;
  endDate?: string;
  status: PriceChangeStatus;
  reason?: string;
  strategy: PricingStrategy;
}

export interface PricingSuggestion {
  id: string;
  productName: string;
  currentPrice: number;
  suggestedPrice: number;
  potentialImpact: number;
  reason: string;
  priority: PricingSuggestionPriority;
  productId: string;
}

export interface PricingMetrics {
  averageMargin: number;
  recentChanges: number;
  scheduledChanges: number;
  promotionalProducts: number;
  totalRevenue: number;
  marginTrend: number;
}
