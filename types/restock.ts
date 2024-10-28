// types/restock.ts
export interface RestockSuggestion {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  recommendedQuantity: number;
  priority: "critical" | "high" | "medium" | "low";
  reason: "low_stock" | "high_demand" | "seasonal" | "trending";
  averageDemand: number;
  lastRestocked?: string;
  supplier: string;
  estimatedCost: number;
  imageUrl?: string;
}

export interface RestockMetrics {
  totalSuggestions: number;
  criticalCount: number;
  estimatedTotalCost: number;
  avgRestockTime: number;
}
