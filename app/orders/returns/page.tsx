"use client";

import { useState, useMemo, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReturnsHeader } from "@/components/returns/ReturnsHeader";
import { ReturnsTable } from "@/components/returns/ReturnsTable";
import { useOrders } from "@/lib/hooks/useOrders";
import { debounce } from "lodash";

export default function Returns() {
  const { orders: returns, loading, error, refreshOrders } = useOrders("returned");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [tempFilter, setTempFilter] = useState({
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
  });

  const [activeFilter, setActiveFilter] = useState({
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
  });

  const toggleFilterModal = () => setIsFilterOpen(!isFilterOpen);

  const applyFilter = () => {
    setActiveFilter(tempFilter);
    toggleFilterModal();
  };

  const resetModalFilters = () => {
    setTempFilter({ startDate: "", endDate: "", minAmount: "", maxAmount: "" });
    setActiveFilter({ startDate: "", endDate: "", minAmount: "", maxAmount: "" });
    toggleFilterModal();
  };

  const filteredReturns = useMemo(() => {
    return returns.filter((returnOrder) => {
      const matchesSearchQuery =
        returnOrder.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        returnOrder.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        returnOrder.returnReason.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDateRange = (() => {
        if (activeFilter.startDate && new Date(returnOrder.date) < new Date(activeFilter.startDate)) {
          return false;
        }
        if (activeFilter.endDate && new Date(returnOrder.date) > new Date(activeFilter.endDate)) {
          return false;
        }
        return true;
      })();

      const matchesAmountRange = (() => {
        const amount = returnOrder.amount;
        if (activeFilter.minAmount && amount < parseFloat(activeFilter.minAmount)) {
          return false;
        }
        if (activeFilter.maxAmount && amount > parseFloat(activeFilter.maxAmount)) {
          return false;
        }
        return true;
      })();

      return matchesSearchQuery && matchesDateRange && matchesAmountRange;
    });
  }, [returns, searchQuery, activeFilter]);

  const handleSearchQueryChange = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 200),
    []
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <ReturnsHeader
          totalReturns={returns.length}
          onSearch={handleSearchQueryChange}
          onRefresh={refreshOrders}
          searchQuery={searchQuery}
          toggleFilterModal={toggleFilterModal}
        />

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredReturns.length > 0 ? (
          <ReturnsTable returns={filteredReturns} />
        ) : (
          <p className="text-center text-gray-500">No returns found</p>
        )}
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
                onClick={resetModalFilters}
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
