// hooks/useOrders.ts
import { useState, useEffect, useCallback } from "react";
import { Order, OrderStatus } from "@/types/orders";

type OrderType = "active" | "completed" | "returned";

// Mock data generator
const generateMockOrders = (type: OrderType): Order[] => {
  const statuses: Record<OrderType, OrderStatus[]> = {
    active: ["pending", "processing", "ready"],
    completed: ["shipped"],
    returned: ["shipped"],
  };

  return Array.from({ length: 10 }, (_, i) => ({
    id: `order-${i + 1}`,
    orderNumber: `ORD-${Math.floor(Math.random() * 10000)}`,
    customerName: `Customer ${i + 1}`,
    customerEmail: `customer${i + 1}@example.com`,
    status: statuses[type][Math.floor(Math.random() * statuses[type].length)],
    paymentStatus: Math.random() > 0.3 ? "paid" : "unpaid",
    priority: Math.random() > 0.5 ? "high" : "medium",
    items: [
      {
        id: `item-${i}-1`,
        productId: `prod-${i + 1}`,
        productName: `Product ${i + 1}`,
        quantity: Math.floor(Math.random() * 5) + 1,
        price: Math.floor(Math.random() * 100) + 10,
        total: Math.floor(Math.random() * 500) + 100,
      },
    ],
    total: Math.floor(Math.random() * 1000) + 100,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    updatedAt: new Date().toISOString(),
    shippingAddress: "123 Main St, City, Country",
    notes: Math.random() > 0.5 ? "Handle with care" : undefined,
    expectedDelivery: new Date(
      Date.now() + Math.random() * 10000000000
    ).toISOString(),
  }));
};

export function useOrders(type: OrderType = "active") {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    dateRange: null as { start: Date; end: Date } | null,
  });

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockOrders = generateMockOrders(type);
      setOrders(mockOrders);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [type]);

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Refresh orders
  const refreshOrders = useCallback(async () => {
    await fetchOrders();
  }, [fetchOrders]);

  // Update order status
  const updateOrderStatus = useCallback(
    async (orderId: string, newStatus: OrderStatus) => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: newStatus,
                  updatedAt: new Date().toISOString(),
                }
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

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (filters.status !== "all" && order.status !== filters.status) {
      return false;
    }

    // Priority filter
    if (filters.priority !== "all" && order.priority !== filters.priority) {
      return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const orderDate = new Date(order.createdAt);
      if (
        orderDate < filters.dateRange.start ||
        orderDate > filters.dateRange.end
      ) {
        return false;
      }
    }

    return true;
  });

  // Order statistics
  const stats = {
    total: filteredOrders.length,
    pending: filteredOrders.filter((o) => o.status === "pending").length,
    processing: filteredOrders.filter((o) => o.status === "processing").length,
    ready: filteredOrders.filter((o) => o.status === "ready").length,
    shipped: filteredOrders.filter((o) => o.status === "shipped").length,
    unpaid: filteredOrders.filter((o) => o.paymentStatus === "unpaid").length,
    highPriority: filteredOrders.filter((o) => o.priority === "high").length,
  };

  // Get single order
  const getOrder = useCallback(
    (orderId: string) => {
      return orders.find((order) => order.id === orderId) || null;
    },
    [orders]
  );

  return {
    orders: filteredOrders,
    loading,
    error,
    stats,
    filters,
    setFilters,
    refreshOrders,
    updateOrderStatus,
    getOrder,
  };
}

// Example usage of date range filter:
/*
const { orders, setFilters } = useOrders('active');

// Set date range filter
setFilters(prev => ({
  ...prev,
  dateRange: {
    start: new Date('2024-02-01'),
    end: new Date('2024-02-28')
  }
}));
*/
