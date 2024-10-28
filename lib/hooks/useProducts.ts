// lib/hooks/useProducts.ts
import { useState, useEffect } from "react";
import { Product } from "@/types/products";
import { getPaginatedMockProducts } from "@/lib/data/mockProducts";

interface ProductFilters {
  categories: string[];
  price: {
    min: number | null;
    max: number | null;
  };
  status: string[];
  stock: string | null;
  tags: string[];
}

interface UseProductsOptions {
  initialPage?: number;
  pageSize?: number;
  initialFilters?: ProductFilters;
  sortField?: string;
  sortOrder?: "asc" | "desc";
}

export function useProducts(options: UseProductsOptions = {}) {
  const {
    initialPage = 1,
    pageSize = 10,
    initialFilters,
    sortField,
    sortOrder = "desc",
  } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<ProductFilters>(
    initialFilters ?? {
      categories: [],
      price: { min: null, max: null },
      status: [],
      stock: null,
      tags: [],
    }
  );

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getPaginatedMockProducts(page, pageSize, {
          category: filters.categories[0], // For now, just use the first category
          status: filters.status[0], // For now, just use the first status
          minPrice: filters.price.min ?? undefined,
          maxPrice: filters.price.max ?? undefined,
          tags: filters.tags,
        });

        if (mounted) {
          setProducts(response.data);
          setTotalPages(response.metadata?.totalPages ?? 1);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, [page, pageSize, filters, sortField, sortOrder]);

  const refreshProducts = async () => {
    setPage(1);
    // This will trigger the useEffect above
  };

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
    setPage(1); // Reset to first page when filters change
  };

  return {
    products,
    loading,
    error,
    page,
    setPage,
    totalPages,
    filters,
    updateFilters,
    refreshProducts,
  };
}
