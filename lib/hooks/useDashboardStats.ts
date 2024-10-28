// lib/hooks/useDashboardStats.ts
import { useState, useEffect } from "react";
import { DashboardStats } from "@/types/dashboard";
import { mockStats } from "@/lib/data/mockStats";

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate API delay
    const loadMockData = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setStats(mockStats);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadMockData();
  }, []);

  // Add some utility functions that might be useful
  const refreshStats = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStats(mockStats);
    setLoading(false);
  };

  const filterByTimeRange = (
    timeRange: "daily" | "weekly" | "monthly" | "yearly"
  ) => {
    // In a real implementation, this would filter the data based on time range
    // For now, we'll just simulate a refresh
    refreshStats();
  };

  return {
    stats,
    loading,
    error,
    refreshStats,
    filterByTimeRange,
  };
}
