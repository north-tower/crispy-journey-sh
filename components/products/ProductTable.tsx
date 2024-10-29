"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { Product } from "@/types/products";

interface ProductTableProps {
  products: Product[];
}

const ProductTable = React.memo(function ProductTable({
  products,
}: ProductTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleRowClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  // Pagination calculations
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, products.length);
  const paginatedProducts = products.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-lg border border-border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Product</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-right font-medium">Price</th>
              <th className="px-4 py-3 text-right font-medium">Stock</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr
                key={product.id}
                onClick={() => handleRowClick(product.id)}
                className="border-t border-border hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-8 h-8 object-cover rounded"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-sm md:text-base">
                        {product.name}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground">
                        {product.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs md:text-base">
                  {product.category}
                </td>
                <td className="px-4 py-3 text-right text-xs md:text-base">
                  ${product.price}
                </td>
                <td className="px-4 py-3 text-right text-xs md:text-base">
                  {product.stock}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs md:text-sm font-medium
                      ${
                        product.status === "in_stock"
                          ? "bg-green-100 text-green-800"
                          : product.status === "low_stock"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                  >
                    {product.status.replace("_", " ")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
        {products.length > 0 && (
          <>
            <p className="text-xs md:text-sm text-muted-foreground">
              Showing {startIndex + 1} to {endIndex} of {products.length}{" "}
              products
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md hover:bg-muted disabled:opacity-50"
              >
                <ChevronLeft className="hidden md:block h-5 w-5" />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-md hover:bg-muted disabled:opacity-50"
              >
                <ChevronRight className="hidden md:block h-5 w-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default ProductTable;
