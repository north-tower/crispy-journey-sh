"use client";

import { useState, useMemo, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Order } from "@/types/orders";
import { motion } from "framer-motion";
import { OrdersHeader } from "@/components/orders/OrdersHeader";
import { OrderFilters } from "@/components/orders/OrderFilters";
import { ActiveOrdersList } from "@/components/orders/ActiveOrdersList";
import { useOrders } from "@/lib/hooks/useOrders";
import { debounce } from "lodash";

export default function ActiveOrdersPage() {
  const { orders, loading, error, refreshOrders } = useOrders("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Memoize filteredOrders to prevent unnecessary recalculations
  const filteredOrders = useMemo(() => {
    return orders.filter((order: Order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Debounced status filter change
  const handleStatusChange = useCallback(
    debounce((newStatus: string) => {
      setStatusFilter(newStatus);
    }, 200),
    []
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <OrdersHeader
          title="Active Orders"
          totalOrders={filteredOrders.length}
          onSearch={setSearchQuery}
          searchQuery={searchQuery}
          onRefresh={refreshOrders}
        />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Sidebar - Left */}
          <div className="xl:col-span-1">
            <OrderFilters
              selectedStatus={statusFilter}
              onStatusChange={handleStatusChange}
              orderCounts={{
                all: orders.length,
                pending: orders.filter(
                  (o: { status: string }) => o.status === "pending"
                ).length,
                processing: orders.filter(
                  (o: { status: string }) => o.status === "processing"
                ).length,
                ready: orders.filter(
                  (o: { status: string }) => o.status === "ready"
                ).length,
                shipped: orders.filter(
                  (o: { status: string }) => o.status === "shipped"
                ).length,
              }}
            />
          </div>

          {/* Main Content - Right */}
          <div className="xl:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }} // Reduced duration
            >
              <ActiveOrdersList
                orders={filteredOrders}
                loading={loading}
                error={error}
                onRefresh={refreshOrders}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
