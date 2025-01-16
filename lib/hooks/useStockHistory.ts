// hooks/useStockHistory.ts
import { useState, useCallback } from "react";
import { StockTransaction, StockHistoryFilters } from "@/types/stock";

export function useStockHistory() {
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<StockHistoryFilters>({});

  const fetchTransactions = useCallback(
    async (filters: StockHistoryFilters = {}) => {
      setLoading(true);
      try {

        console.log(filters)
        // Mock API call - replace with actual API
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Mock data
        const mockTransactions: StockTransaction[] = [
          {
            id: "1",
            productId: "p1",
            productName: "Wireless Earbuds",
            action: "increase",
            quantity: 50,
            previousStock: 10,
            currentStock: 60,
            timestamp: new Date().toISOString(),
            userId: "u1",
            userName: "John Doe",
            note: "Restocked from supplier",
          },
          // Add more mock data
        ];
        setTransactions(mockTransactions);
      } catch (error) {
        console.error("Error fetching stock history:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    transactions,
    loading,
    filters,
    setFilters,
    fetchTransactions,
  };
}
