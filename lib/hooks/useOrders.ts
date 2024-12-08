import { useState, useEffect, useCallback } from "react";
import { Order, OrderStatus } from "@/types/orders";
import axios from "axios";

type OrderType = "active" | "completed" | "returned";

export function useOrders(type: OrderType = "active") {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Fixed limit per page
  const [total, setTotal] = useState(0); // Total number of orders from API

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8900/api/orders`,
      //    {
      //   params: { type, page, limit },
      // }
    );

      setOrders(response.data.data); // API should return paginated data as { data, total }
      setTotal(response.data.total);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [type, page, limit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const refreshOrders = useCallback(async () => {
    await fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = useCallback(
    async (orderId: string, newStatus: OrderStatus) => {
      try {
        await axios.patch(`http://localhost:8900/api/orders/${orderId}`, { status: newStatus });
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
              : order
          )
        );
        return true;
      } catch (err) {
        setError(err as Error);
        return false;
      }
    },
    []
  );

  return {
    orders,
    loading,
    error,
    total,
    page,
    setPage, // Expose setPage for pagination
    limit,
    refreshOrders,
    updateOrderStatus,
  };
}
