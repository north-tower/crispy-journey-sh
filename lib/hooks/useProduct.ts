// lib/hooks/useProduct.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { Product, ProductVariation } from "@/types/products";
import {
  getMockProduct,
  updateMockProduct,
  deleteMockProduct,
  simulateApiCall,
} from "@/lib/data/mockProducts";

interface ProductHookState {
  product: Product | null;
  loading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  isValidating: boolean;
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
  reset: () => void;
}

interface UseProductOptions {
  initialData?: Product;
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  pollingInterval?: number;
  shouldRetry?: boolean;
  maxRetries?: number;
  onSuccess?: (data: Product) => void;
  onError?: (error: Error) => void;
  onMutate?: () => void;
}

type UseProductReturn = ProductHookState & ProductHookActions;

export function useProduct(
  productId: string,
  options: UseProductOptions = {}
): UseProductReturn {
  const {
    initialData,
    revalidateOnFocus = true,
    revalidateOnReconnect = true,
    pollingInterval = 0,
    shouldRetry = true,
    maxRetries = 3,
    onSuccess,
    onError,
    onMutate,
  } = options;

  const [state, setState] = useState<ProductHookState>({
    product: initialData || null,
    loading: !initialData,
    error: null,
    lastUpdated: initialData ? new Date() : null,
    isValidating: false,
  });

  // Refs for cleanup and retry logic
  const abortControllerRef = useRef<AbortController | null>(null);
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const mountedRef = useRef(true);

  // Safe setState that checks if component is mounted
  const safeSetState = useCallback((updates: Partial<ProductHookState>) => {
    if (mountedRef.current) {
      setState((prev) => ({ ...prev, ...updates }));
    }
  }, []);

  // Main fetch function
  const fetchProduct = useCallback(
    async (signal?: AbortSignal) => {
      try {
        safeSetState({ isValidating: true });
        onMutate?.();

        const product = await simulateApiCall(getMockProduct(productId), 1000);

        if (!product) {
          throw new Error("Product not found");
        }

        safeSetState({
          product,
          loading: false,
          error: null,
          lastUpdated: new Date(),
          isValidating: false,
        });

        onSuccess?.(product);
        retryCountRef.current = 0;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;

        if (shouldRetry && retryCountRef.current < maxRetries) {
          retryCountRef.current += 1;
          await fetchProduct(signal);
          return;
        }

        safeSetState({
          loading: false,
          error: error as Error,
          isValidating: false,
        });

        onError?.(error as Error);
      }
    },
    [
      productId,
      maxRetries,
      shouldRetry,
      onSuccess,
      onError,
      onMutate,
      safeSetState,
    ]
  );

  // Update product
  const updateProduct = useCallback(
    async (updates: Partial<Product>) => {
      try {
        safeSetState({ loading: true });
        onMutate?.();

        const updatedProduct = await simulateApiCall(
          updateMockProduct(productId, updates),
          500
        );

        if (!updatedProduct) {
          throw new Error("Failed to update product");
        }

        safeSetState({
          product: updatedProduct,
          loading: false,
          error: null,
          lastUpdated: new Date(),
        });

        onSuccess?.(updatedProduct);
      } catch (error) {
        safeSetState({
          loading: false,
          error: error as Error,
        });
        onError?.(error as Error);
        throw error;
      }
    },
    [productId, onSuccess, onError, onMutate, safeSetState]
  );

  // Update variation
  const updateVariation = useCallback(
    async (variationId: string, updates: Partial<ProductVariation>) => {
      try {
        safeSetState({ loading: true });
        onMutate?.();

        // Find and update the specific variation in the product
        const currentProduct = state.product;
        if (!currentProduct?.variations) {
          throw new Error("No variations found");
        }

        const updatedVariations = currentProduct.variations.map((v) =>
          v.id === variationId ? { ...v, ...updates } : v
        );

        const updatedProduct = await simulateApiCall(
          updateMockProduct(productId, {
            ...currentProduct,
            variations: updatedVariations,
          }),
          500
        );

        if (!updatedProduct) {
          throw new Error("Failed to update variation");
        }

        safeSetState({
          product: updatedProduct,
          loading: false,
          error: null,
          lastUpdated: new Date(),
        });

        onSuccess?.(updatedProduct);
      } catch (error) {
        safeSetState({
          loading: false,
          error: error as Error,
        });
        onError?.(error as Error);
        throw error;
      }
    },
    [productId, state.product, onSuccess, onError, onMutate, safeSetState]
  );

  // Delete product
  const deleteProduct = useCallback(async () => {
    try {
      safeSetState({ loading: true });
      onMutate?.();

      const success = await simulateApiCall(deleteMockProduct(productId), 500);

      if (!success) {
        throw new Error("Failed to delete product");
      }

      safeSetState({
        product: null,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      });
    } catch (error) {
      safeSetState({
        loading: false,
        error: error as Error,
      });
      onError?.(error as Error);
      throw error;
    }
  }, [productId, onError, onMutate, safeSetState]);

  // Add variation
  const addVariation = useCallback(
    async (variation: Omit<ProductVariation, "id">) => {
      try {
        safeSetState({ loading: true });
        onMutate?.();

        const currentProduct = state.product;
        if (!currentProduct) {
          throw new Error("Product not found");
        }

        const newVariation: ProductVariation = {
          ...variation,
          id: `${productId}-var-${Date.now()}`,
        };

        const updatedProduct = await simulateApiCall(
          updateMockProduct(productId, {
            ...currentProduct,
            variations: [...(currentProduct.variations || []), newVariation],
          }),
          500
        );

        if (!updatedProduct) {
          throw new Error("Failed to add variation");
        }

        safeSetState({
          product: updatedProduct,
          loading: false,
          error: null,
          lastUpdated: new Date(),
        });

        onSuccess?.(updatedProduct);
      } catch (error) {
        safeSetState({
          loading: false,
          error: error as Error,
        });
        onError?.(error as Error);
        throw error;
      }
    },
    [productId, state.product, onSuccess, onError, onMutate, safeSetState]
  );

  // Delete variation
  const deleteVariation = useCallback(
    async (variationId: string) => {
      try {
        safeSetState({ loading: true });
        onMutate?.();

        const currentProduct = state.product;
        if (!currentProduct?.variations) {
          throw new Error("No variations found");
        }

        const updatedVariations = currentProduct.variations.filter(
          (v) => v.id !== variationId
        );

        const updatedProduct = await simulateApiCall(
          updateMockProduct(productId, {
            ...currentProduct,
            variations: updatedVariations,
          }),
          500
        );

        if (!updatedProduct) {
          throw new Error("Failed to delete variation");
        }

        safeSetState({
          product: updatedProduct,
          loading: false,
          error: null,
          lastUpdated: new Date(),
        });

        onSuccess?.(updatedProduct);
      } catch (error) {
        safeSetState({
          loading: false,
          error: error as Error,
        });
        onError?.(error as Error);
        throw error;
      }
    },
    [productId, state.product, onSuccess, onError, onMutate, safeSetState]
  );

  // Reset state
  const reset = useCallback(() => {
    safeSetState({
      product: initialData || null,
      loading: false,
      error: null,
      lastUpdated: null,
      isValidating: false,
    });
  }, [initialData, safeSetState]);

  // Set up polling
  useEffect(() => {
    if (pollingInterval > 0) {
      pollingTimeoutRef.current = setInterval(() => {
        fetchProduct();
      }, pollingInterval);

      return () => {
        if (pollingTimeoutRef.current) {
          clearInterval(pollingTimeoutRef.current);
        }
      };
    }
  }, [pollingInterval, fetchProduct]);

  // Set up focus and reconnect revalidation
  useEffect(() => {
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
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProduct]);

  return {
    ...state,
    refetch: () => fetchProduct(),
    updateProduct,
    updateVariation,
    deleteProduct,
    addVariation,
    deleteVariation,
    reset,
  };
}
