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
      const response = await fetch('http://localhost:8900/api/products/overview/data');
      if (!response.ok) {
        throw new Error('Failed to fetch pricing data');
      }
      const data = await response.json();

      setMetrics(data.metrics);
      setChanges(data.changes);
      setSuggestions(data.suggestions);
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

