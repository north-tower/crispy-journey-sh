// lib/hooks/useProduct.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { Product, ProductVariation } from "@/types/products";

interface ProductHookState {
  product: Product | null;
  loading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
}

interface ProductHookActions {
  refetch: () => Promise<void>;
  updateProduct: (updates: Partial<Product>) => Promise<void>;
  updateVariation: (
    variationId: string,
    updates: Partial<ProductVariation>
  ) => Promise<void>;
  deleteProduct: () => Promise<void>;
  addVariation: (variation: Omit<ProductVariation, "id">) => Promise<void>;
  deleteVariation: (variationId: string) => Promise<void>;
}

interface UseProductOptions {
  initialData?: Product;
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  pollingInterval?: number;
}

export function useProduct(
  productId: string,
  options: UseProductOptions = {}
): ProductHookState & ProductHookActions {
  const {
    initialData,
    revalidateOnFocus = true,
    revalidateOnReconnect = true,
    pollingInterval = 0,
  } = options;

  const [state, setState] = useState<ProductHookState>({
    product: initialData || null,
    loading: !initialData,
    error: null,
    lastUpdated: initialData ? new Date() : null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch product data
  const fetchProduct = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        // Simulated API call - replace with actual API call
        const response = await fetch(`/api/products/${productId}`, { signal });
        if (!response.ok) throw new Error("Failed to fetch product");

        const data = await response.json();

        setState((prev) => ({
          product: data,
          loading: false,
          error: null,
          lastUpdated: new Date(),
        }));
      } catch (error) {
        if ((error as Error).name === "AbortError") return;

        setState((prev) => ({
          ...prev,
          loading: false,
          error: error as Error,
        }));
      }
    },
    [productId]
  );

  // Set up polling
  useEffect(() => {
    if (pollingInterval > 0) {
      const poll = () => {
        pollingTimeoutRef.current = setTimeout(() => {
          fetchProduct();
          poll();
        }, pollingInterval);
      };

      poll();

      return () => {
        if (pollingTimeoutRef.current) {
          clearTimeout(pollingTimeoutRef.current);
        }
      };
    }
  }, [pollingInterval, fetchProduct]);

  // Set up focus and reconnect revalidation
  useEffect(() => {
    if (!revalidateOnFocus && !revalidateOnReconnect) return;

    const onVisibilityChange = () => {
      if (revalidateOnFocus && document.visibilityState === "visible") {
        fetchProduct();
      }
    };

    const onOnline = () => {
      if (revalidateOnReconnect) {
        fetchProduct();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("online", onOnline);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("online", onOnline);
    };
  }, [revalidateOnFocus, revalidateOnReconnect, fetchProduct]);

  // Initial fetch
  useEffect(() => {
    abortControllerRef.current = new AbortController();
    fetchProduct(abortControllerRef.current.signal);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProduct]);

  // Actions
  const refetch = useCallback(async () => {
    await fetchProduct();
  }, [fetchProduct]);

  const updateProduct = useCallback(
    async (updates: Partial<Product>) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        // Simulated API call - replace with actual API call
        const response = await fetch(`/api/products/${productId}`, {
          method: "PATCH",
          body: JSON.stringify(updates),
        });

        if (!response.ok) throw new Error("Failed to update product");

        const updatedProduct = await response.json();

        setState((prev) => ({
          product: updatedProduct,
          loading: false,
          error: null,
          lastUpdated: new Date(),
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error as Error,
        }));
        throw error;
      }
    },
    [productId]
  );

  const updateVariation = useCallback(
    async (variationId: string, updates: Partial<ProductVariation>) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        // Simulated API call - replace with actual API call
        const response = await fetch(
          `/api/products/${productId}/variations/${variationId}`,
          {
            method: "PATCH",
            body: JSON.stringify(updates),
          }
        );

        if (!response.ok) throw new Error("Failed to update variation");

        const updatedProduct = await response.json();

        setState((prev) => ({
          product: updatedProduct,
          loading: false,
          error: null,
          lastUpdated: new Date(),
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error as Error,
        }));
        throw error;
      }
    },
    [productId]
  );

  const deleteProduct = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      // Simulated API call - replace with actual API call
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product");

      setState((prev) => ({
        product: null,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error as Error,
      }));
      throw error;
    }
  }, [productId]);

  const addVariation = useCallback(
    async (variation: Omit<ProductVariation, "id">) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        // Simulated API call - replace with actual API call
        const response = await fetch(`/api/products/${productId}/variations`, {
          method: "POST",
          body: JSON.stringify(variation),
        });

        if (!response.ok) throw new Error("Failed to add variation");

        const updatedProduct = await response.json();

        setState((prev) => ({
          product: updatedProduct,
          loading: false,
          error: null,
          lastUpdated: new Date(),
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error as Error,
        }));
        throw error;
      }
    },
    [productId]
  );

  const deleteVariation = useCallback(
    async (variationId: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        // Simulated API call - replace with actual API call
        const response = await fetch(
          `/api/products/${productId}/variations/${variationId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) throw new Error("Failed to delete variation");

        const updatedProduct = await response.json();

        setState((prev) => ({
          product: updatedProduct,
          loading: false,
          error: null,
          lastUpdated: new Date(),
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error as Error,
        }));
        throw error;
      }
    },
    [productId]
  );

  return {
    ...state,
    refetch,
    updateProduct,
    updateVariation,
    deleteProduct,
    addVariation,
    deleteVariation,
  };
}
