import { useState, useEffect, useCallback, useMemo } from "react";

const mapTimeRangeToBackend = (timeRange: "24h" | "7d" | "30d"): string => {
  switch (timeRange) {
    case "24h":
      return "daily"; // Backend expects "daily"
    case "7d":
      return "weekly"; // Backend expects "weekly"
    case "30d":
      return "monthly"; // Backend expects "monthly"
    default:
      return "weekly"; // Default to "weekly" if unknown
  }
};

export function useOrderVolumeStats(timeRange: "24h" | "7d" | "30d", orderType: string = "completed") {
  const [orderData, setOrderData] = useState<any>(null); // State to store the fetched order data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrderData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const mappedTimeRange = mapTimeRangeToBackend(timeRange); // Use the mapping function

      // Fetch order data from the API with timeRange and orderType as query parameters
      const response = await fetch(
        `http://localhost:8900/api/orders/overview/volume-and-metrics?timeRange=${mappedTimeRange}&status=${orderType}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch order data: ${response.statusText}`);
      }

      const data = await response.json();
      setOrderData(data); // Set the fetched data in state
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [timeRange, orderType]);

  // Fetch order data when timeRange or orderType changes
  useEffect(() => {
    fetchOrderData();
  }, [fetchOrderData]);

  const refreshOrderData = useCallback(async () => {
    await fetchOrderData();
  }, [fetchOrderData]);

  // Memoize the returned values
  return useMemo(
    () => ({
      orderData,
      loading,
      error,
      refreshOrderData,
    }),
    [orderData, loading, error, refreshOrderData]
  );
}
