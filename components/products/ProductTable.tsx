"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { products } from "@/types/products";

export default function ProductTable() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleRowClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  return (
    <div className="space-y-4">
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
            {products.map((product) => (
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
        <p className="text-xs md:text-sm text-muted-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, products.length)} of{" "}
          {products.length} products
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
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage * itemsPerPage >= products.length}
            className="p-2 rounded-md hover:bg-muted disabled:opacity-50"
          >
            <ChevronRight className="hidden md:block h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
