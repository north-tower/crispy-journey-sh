"use client";

import { useState, useEffect } from "react";

interface TopProduct {
  productId: string;
  productName: string;
  quantitySold: number;
  sales: number;
}

export function TopProducts({ timeRange }: { timeRange: string }) {
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8900/api/dashboard/stats?timeRange=${timeRange}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch top products.");
        }

        const data = await response.json();
        setTopProducts(
          data.topProducts.map((product) => ({
            productId: product.productId,
            productName: product.productName,
            quantitySold: parseInt(product.quantitySold, 10),
            sales: parseFloat(product.sales),
          }))
        );
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, [timeRange]);

  if (loading) {
    return <p>Loading top products...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Top Selling Products
      </h3>
      {topProducts.length === 0 ? (
        <p>No top products available.</p>
      ) : (
        <div className="space-y-4">
          {topProducts.map((product) => (
            <div
              key={product.productId}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div>
                <p className="font-medium text-gray-900">{product.productName}</p>
                <p className="text-sm text-gray-500">
                  {product.quantitySold} sales
                </p>
              </div>
              <p className="font-medium text-gray-900">
                ${product.sales.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
