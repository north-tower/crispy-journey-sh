// pages/ProductsPage.tsx
"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProductHeader } from "@/components/products/ProductHeader";
import { useState, useEffect, useMemo, Suspense } from "react";
import { products } from "@/types/products";
import { AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import components with loading states
const DynamicProductGrid = dynamic(
  () => import("@/components/products/ProductGrid"),
  {
    loading: () => <LoadingGrid />,
    ssr: false,
  }
);

const DynamicProductTable = dynamic(
  () => import("@/components/products/ProductTable"),
  {
    loading: () => <LoadingTable />,
    ssr: false,
  }
);

// Loading states components
const LoadingGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="h-[300px] bg-gray-200 rounded-lg"></div>
    ))}
  </div>
);

const LoadingTable = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-12 bg-gray-200 rounded-lg"></div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
    ))}
  </div>
);

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Debounced search query
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Force grid view on smaller screens with debounce
  useEffect(() => {
    const handleResize = () => {
      requestAnimationFrame(() => {
        if (window.innerWidth < 768) {
          setViewMode("grid");
        }
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Memoized filtered products with optimized search
  const filteredProducts = useMemo(() => {
    const searchLower = debouncedQuery.toLowerCase();
    return searchLower
      ? products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower) ||
            product.category.toLowerCase().includes(searchLower)
        )
      : products;
  }, [debouncedQuery]);

  // Memoized view component
  const ProductView = useMemo(() => {
    if (isLoading) return null;

    if (filteredProducts.length === 0) {
      return (
        <div className="p-4 text-center text-muted-foreground">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          No products found
        </div>
      );
    }

    const ViewComponent =
      viewMode === "table" ? DynamicProductTable : DynamicProductGrid;
    return <ViewComponent products={filteredProducts} />;
  }, [viewMode, filteredProducts, isLoading]);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <ProductHeader
          viewMode={viewMode}
          onViewModeChange={(mode) => setViewMode(mode)}
          onSearch={setSearchQuery}
        />

        <div className="min-h-[500px]">
          {" "}
          {/* Fixed minimum height container */}
          <Suspense
            fallback={viewMode === "table" ? <LoadingTable /> : <LoadingGrid />}
          >
            {/* Show Table only on md and larger */}
            <div className="hidden md:block">{ProductView}</div>

            {/* Always show Grid view on small screens */}
            <div className="block md:hidden">
              <DynamicProductGrid products={filteredProducts} />
            </div>
          </Suspense>
        </div>
      </div>
    </DashboardLayout>
  );
}
