"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ProductGrid from "@/components/products/ProductGrid";
import { ProductHeader } from "@/components/products/ProductHeader";
import ProductTable from "@/components/products/ProductTable";
import { useState, useEffect } from "react";

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Force grid view on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode("grid");
      }
    };
    handleResize(); // Check on initial load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <ProductHeader
          viewMode={viewMode}
          onViewModeChange={(mode) => setViewMode(mode)}
        />

        {/* Show Table only on md and larger */}
        <div className="hidden md:block">
          {viewMode === "table" ? <ProductTable /> : <ProductGrid />}
        </div>

        {/* Always show Grid view on small screens */}
        <div className="block md:hidden">
          <ProductGrid />
        </div>
      </div>
    </DashboardLayout>
  );
}
