// app/returns/page.tsx
"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReturnsHeader } from "@/components/returns/ReturnsHeader";
import { ReturnsTable } from "@/components/returns/ReturnsTable";
import { ReturnOrder } from "@/types/returns";
import { debounce } from "lodash";

// Mock data (move to a separate file in production)
const mockReturns: ReturnOrder[] = [
  {
    id: "1",
    orderNumber: "ORD-9241-RET",
    customer: {
      name: "Customer 1",
      email: "customer1@example.com",
    },
    returnReason: "Wrong size",
    status: "pending",
    amount: 545.0,
    date: "2024-08-16",
    items: [
      {
        id: "item-1",
        productName: "Product 1",
        quantity: 1,
        reason: "Size too small",
        condition: "new",
        refundAmount: 545.0,
      },
    ],
  },
  // Add more mock data
];

export default function Returns() {
  const [searchQuery, setSearchQuery] = useState("");
  const [returns] = useState<ReturnOrder[]>(mockReturns);

  // Memoize filtered returns
  const filteredReturns = useMemo(() => {
    return returns.filter(
      (returnOrder) =>
        returnOrder.orderNumber
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        returnOrder.customer.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        returnOrder.returnReason
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  }, [returns, searchQuery]);

  // Debounced search query update
  const handleSearchQueryChange = debounce((query: string) => {
    setSearchQuery(query);
  }, 200);

  const handleRefresh = () => {
    // Implement refresh logic
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <ReturnsHeader
          totalReturns={returns.length}
          onSearch={handleSearchQueryChange}
          onRefresh={handleRefresh}
          searchQuery={searchQuery}
        />

        <ReturnsTable returns={filteredReturns} />
      </div>
    </DashboardLayout>
  );
}
