"use client";

import { useState, useMemo, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Order } from "@/types/orders";
import { motion } from "framer-motion";
import { OrdersHeader } from "@/components/orders/OrdersHeader";
import { OrderFilters } from "@/components/orders/OrderFilters";
import { ActiveOrdersList } from "@/components/orders/ActiveOrdersList";
import { useOrders } from "@/lib/hooks/useOrders";

export default function ActiveOrdersPage() {
  const {
    orders,
    loading,
    error,
    total,
    page,
    setPage,
    limit,
    refreshOrders,
  } = useOrders("active"); // or use any other type like "completed", "returned"
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all"); // Filter set by OrderFilters
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [tempFilter, setTempFilter] = useState({
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
  });

  // Reset filters in the modal
  const resetModalFilters = () => {
    setTempFilter({
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
    });
    setAppliedFilters({
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
    });
    setIsFilterOpen(false);
  };

  // Reset status filter in OrderFilters
  const resetStatusFilter = () => setStatusFilter("all");

  const toggleFilterModal = () => setIsFilterOpen(!isFilterOpen);

  const applyFilter = () => {
    setAppliedFilters(tempFilter); // Apply tempFilter to the main filters
    setIsFilterOpen(false); // Close modal
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order: Order) => {
     
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesDateRange =
        (!appliedFilters.startDate || new Date(order.createdAt) >= new Date(appliedFilters.startDate)) &&
        (!appliedFilters.endDate || new Date(order.createdAt) <= new Date(appliedFilters.endDate));
      const matchesAmountRange =
        (!appliedFilters.minAmount || order.total >= parseFloat(appliedFilters.minAmount)) &&
        (!appliedFilters.maxAmount || order.total <= parseFloat(appliedFilters.maxAmount));

      return  matchesStatus && matchesDateRange && matchesAmountRange;
    });
  }, [orders, searchQuery, statusFilter, appliedFilters]);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <OrdersHeader
          title="Active Orders"
          totalOrders={filteredOrders.length}
          onSearch={setSearchQuery}
          searchQuery={searchQuery}
          onRefresh={refreshOrders}
          toggleFilterModal={toggleFilterModal}
        />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-1">
            <OrderFilters
              selectedStatus={statusFilter}
              onStatusChange={setStatusFilter} // Directly set statusFilter
              orderCounts={{
                all: orders.length,
                pending: orders.filter((o) => o.status === "PENDING").length,
                processing: orders.filter((o) => o.status === "PROCESSING").length,
                ready: orders.filter((o) => o.status === "READY").length,
                shipped: orders.filter((o) => o.status === "SHIPPED").length,
              }}
              onResetStatus={resetStatusFilter} // Reset status
            />
          </div>

          <div className="xl:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
               <ActiveOrdersList
      orders={filteredOrders}
      loading={loading}
      error={error}
      onRefresh={refreshOrders}
      total={total}
      page={page}
      setPage={setPage}
      limit={limit}
    />
            </motion.div>
          </div>
        </div>
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 space-y-4">
            <h3 className="text-lg font-semibold">Filter Options</h3>

            <div>
              <label className="text-sm">Start Date:</label>
              <input
                type="date"
                className="w-full p-2 mt-1 border rounded-full"
                onChange={(e) => setTempFilter({ ...tempFilter, startDate: e.target.value })}
                value={tempFilter.startDate}
              />
            </div>

            <div>
              <label className="text-sm">End Date:</label>
              <input
                type="date"
                className="w-full p-2 mt-1 border rounded-full"
                onChange={(e) => setTempFilter({ ...tempFilter, endDate: e.target.value })}
                value={tempFilter.endDate}
              />
            </div>

            <div>
              <label className="text-sm">Min Amount:</label>
              <input
                type="number"
                className="w-full p-2 mt-1 border rounded-full"
                placeholder="Minimum amount"
                onChange={(e) => setTempFilter({ ...tempFilter, minAmount: e.target.value })}
                value={tempFilter.minAmount}
              />
            </div>

            <div>
              <label className="text-sm">Max Amount:</label>
              <input
                type="number"
                className="w-full p-2 mt-1 border rounded-full"
                placeholder="Maximum amount"
                onChange={(e) => setTempFilter({ ...tempFilter, maxAmount: e.target.value })}
                value={tempFilter.maxAmount}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={resetModalFilters} // Reset modal filters
                className="px-4 py-2 bg-gray-300 rounded-full"
              >
                Reset
              </button>
              <button
                onClick={applyFilter}
                className="px-4 py-2 bg-primary-600 text-white rounded-full"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}


