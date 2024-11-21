"use client";

import { useState, useMemo, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useOrders } from "@/lib/hooks/useOrders";
import { CompletedFilters } from "@/components/orders/completed/CompletedFilters";
import { CompletedHeader } from "@/components/orders/completed/CompletedHeader";
import { CompletedOrdersList } from "@/components/orders/completed/CompletedOrdersList";
import { debounce } from "lodash";
import dayjs from "dayjs";

export default function CompletedOrdersPage() {
  const { orders, loading, error, refreshOrders } = useOrders("completed");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<"week" | "month" | "year">("month");
  const [view, setView] = useState<"grid" | "table">("table");

  // Filter orders based on search query and date filter
  const filteredOrders = useMemo(() => {
    const filteredBySearch = orders.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredByDate = filteredBySearch.filter((order) => {
      const orderDate = dayjs(order.createdAt);
      const now = dayjs();
      if (dateFilter === "week") return orderDate.isAfter(now.subtract(1, "week"));
      if (dateFilter === "month") return orderDate.isAfter(now.subtract(1, "month"));
      if (dateFilter === "year") return orderDate.isAfter(now.subtract(1, "year"));
      return true;
    });

    return filteredByDate;
  }, [orders, searchQuery, dateFilter]);

  // Debounce date filter change
  const handleDateFilterChange = useCallback(
    debounce((newDateFilter: "week" | "month" | "year") => {
      setDateFilter(newDateFilter);
    }, 200),
    []
  );

  // Debounce search input
  const handleSearchChange = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 300),
    []
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <CompletedHeader
          totalOrders={filteredOrders.length}
          onSearch={handleSearchChange}
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