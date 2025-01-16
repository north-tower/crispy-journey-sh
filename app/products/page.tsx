"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProductHeader } from "@/components/products/ProductHeader";
import { useState, useEffect, useMemo, Suspense } from "react";
import { AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { fetchProductsAPI } from "@/services/products";
import { Product } from "@/types/products";

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

// Loading state components
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
  const [products, setProducts] = useState<Product[]>([]); // Store fetched products
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchProductsAPI();
      const updatedProducts = data.map((product: Product) => ({
        ...product,
        status:
          product.stock >= 10
            ? "in_stock"
            : product.stock >= 0 && product.stock <= 10
            ? "low_stock"
            : "out_of_stock",
      }));
      

      setProducts(updatedProducts);
    } catch (err) {
      setError(err.message || "Failed to fetch products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  // Fetch products on page load
  useEffect(() => {
    

    fetchProducts();
  }, []);

  const handleProductCreated = () => {
    fetchProducts(); // Trigger data reload when a new product is created
  };

  // Handle debounced search query
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Enforce grid view on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode("grid");
      }
    };

    handleResize(); // Check on page load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    const searchLower = debouncedQuery.toLowerCase();
    return searchLower
      ? products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower) ||
            product.categoryName.toLowerCase().includes(searchLower)
        )
      : products;
  }, [debouncedQuery, products]);

  // Render view component (grid or table)
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
          onProductCreated={handleProductCreated} // Trigger data refresh
        />

        <div className="min-h-[500px]">
          {error ? (
            <div className="p-4 text-center text-red-600">
              <AlertCircle className="w-12 h-12 mx-auto mb-3" />
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg bg-primary-400 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500"
              >
                Retry
              </button>
            </div>
          ) : (
            <Suspense
              fallback={viewMode === "table" ? <LoadingTable /> : <LoadingGrid />}
            >
              <div className="hidden md:block">{ProductView}</div>
              <div className="block md:hidden">
                <DynamicProductGrid products={filteredProducts} />
              </div>
            </Suspense>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
