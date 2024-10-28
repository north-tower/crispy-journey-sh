// lib/hooks/usePricingData.ts
import { useState, useEffect } from "react";
import {
  PricingMetrics,
  PriceChange,
  PricingSuggestion,
} from "@/types/pricing";

interface UsePricingDataReturn {
  metrics: PricingMetrics | null;
  changes: PriceChange[];
  suggestions: PricingSuggestion[];
  loading: boolean;
  error: Error | null;
  refreshData: () => Promise<void>;
}

export function usePricingData(): UsePricingDataReturn {
  const [metrics, setMetrics] = useState<PricingMetrics | null>(null);
  const [changes, setChanges] = useState<PriceChange[]>([]);
  const [suggestions, setSuggestions] = useState<PricingSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Mock data
      const mockSuggestions: PricingSuggestion[] = [
        {
          id: "1",
          productId: "PROD-001",
          productName: "Wireless Earbuds",
          currentPrice: 99.99,
          suggestedPrice: 129.99,
          potentialImpact: 15.5,
          reason:
            "High demand and competitor pricing analysis suggests room for increase",
          priority: "high",
        },
        {
          id: "2",
          productId: "PROD-002",
          productName: "Smart Watch",
          currentPrice: 199.99,
          suggestedPrice: 179.99,
          potentialImpact: -5.2,
          reason: "Multiple competitors have reduced prices",
          priority: "medium",
        },
        // Add more mock suggestions
      ];

      setMetrics({
        averageMargin: 32.5,
        recentChanges: 24,
        scheduledChanges: 8,
        promotionalProducts: 12,
        totalRevenue: 125000,
        marginTrend: 5.2,
      });

      setChanges([
        // Add mock price changes
      ]);

      setSuggestions(mockSuggestions);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    metrics,
    changes,
    suggestions,
    loading,
    error,
    refreshData: fetchData,
  };
}
