import { useState, useEffect, useCallback, useMemo } from "react";
import { DashboardStats } from "@/types/dashboard";
import { API_BASE_URL } from "@/services/products";

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async (timeRange: string = "monthly") => {
    try {
      setLoading(true);
      setError(null);
    
      // Fetch data from the backend API
      const response = await fetch(`${API_BASE_URL}/dashboard/stats?timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard stats: ${response.statusText}`);
      }

      const data: DashboardStats = await response.json();
      setStats(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch initial stats
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const refreshStats = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);

  const filterByTimeRange = useCallback(
    async (timeRange: "daily" | "weekly" | "monthly" | "yearly" | "quarterly") => {
      await fetchStats(timeRange);
    },
    [fetchStats]
  );

  // Memoize returned values
  return useMemo(
    () => ({
      stats,
      loading,
      error,
      refreshStats,
      filterByTimeRange,
    }),
    [stats, loading, error, refreshStats, filterByTimeRange]
  );
}
