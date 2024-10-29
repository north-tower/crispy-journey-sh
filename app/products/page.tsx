// pages/ProductsPage.tsx
'use client'
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import ProductGrid from "@/components/products/ProductGrid";
import { ProductHeader } from "@/components/products/ProductHeader";
import ProductTable from "@/components/products/ProductTable";
import { useState, useEffect, useMemo } from "react";
import { products } from "@/types/products"
import { AlertCircle } from "lucide-react";

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Memoized filtered products based on search query
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <ProductHeader
          viewMode={viewMode}
          onViewModeChange={(mode) => setViewMode(mode)}
          onSearch={setSearchQuery} // Pass setSearchQuery to ProductHeader
        />

        {/* Show Table only on md and larger */}
        <div className="hidden md:block">

          {
            filteredProducts.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  No products found
              </div>
            ) :
          
          viewMode === "table" ? (
            <ProductTable products={filteredProducts} />
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </div>

        {/* Always show Grid view on small screens */}
        <div className="block md:hidden">
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </DashboardLayout>
  );
}
