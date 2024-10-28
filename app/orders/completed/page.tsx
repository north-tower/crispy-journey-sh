"use client";

import { useState, useMemo, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useOrders } from "@/lib/hooks/useOrders";
import { CompletedFilters } from "@/components/orders/completed/CompletedFilters";
import { CompletedHeader } from "@/components/orders/completed/CompletedHeader";
import { CompletedOrdersList } from "@/components/orders/completed/CompletedOrdersList";
import { debounce } from "lodash";

export default function CompletedOrdersPage() {
  const { orders, loading, error, refreshOrders } = useOrders("completed");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<"week" | "month" | "year">(
    "month"
  );
  const [view, setView] = useState<"grid" | "table">("table");

  // Memoize filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [orders, searchQuery]);

  // Debounce date filter change
  const handleDateFilterChange = useCallback(
    debounce((newDateFilter: "week" | "month" | "year") => {
      setDateFilter(newDateFilter);
    }, 200),
    []
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <CompletedHeader
          totalOrders={filteredOrders.length}
          onSearch={setSearchQuery}
          searchQuery={searchQuery}
          onRefresh={refreshOrders}
          dateFilter={dateFilter}
          onDateFilterChange={handleDateFilterChange}
        />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Filters - Left Side */}
          <div className="xl:col-span-1">
            <CompletedFilters orders={filteredOrders} />
          </div>

          {/* Orders List - Right Side */}
          <div className="xl:col-span-3">
            <CompletedOrdersList
              orders={filteredOrders}
              loading={loading}
              error={error}
              view={view}
              onViewChange={setView}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
