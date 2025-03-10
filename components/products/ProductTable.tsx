"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { Product } from "@/types/products";


interface ProductTableProps {
  products: Product[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const ProductTable = React.memo(function ProductTable({
  products,
  totalPages,
  currentPage,
  onPageChange,
}: ProductTableProps) {
  const router = useRouter();

  const handleRowClick = (productId: string) => {
    router.push(`/products/${productId}?page=${currentPage}`);
  };

  // Generate page numbers with ellipsis for long lists
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        // First few pages
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Last few pages
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Middle pages
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

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
                        src={`https://shopeazz-s3-storage1.s3.eu-north-1.amazonaws.com/uploads/${product.images?.[0]?.filename}`}
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
                  {product.categoryName}
                </td>
                <td className="px-4 py-3 text-right text-xs md:text-base">
                  KES{product.sellingPrice}
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
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md hover:bg-muted disabled:opacity-50"
              >
                <ChevronLeft className="hidden md:block h-5 w-5" />
              </button>

              {/* Pagination numbers */}
              <div className="hidden md:flex items-center gap-1">
                {getPageNumbers().map((pageNum, index) => (
                  <button
                    key={index}
                    onClick={() => 
                      typeof pageNum === 'number' && onPageChange(pageNum)
                    }
                    className={`px-3 py-1 rounded-md text-sm ${
                      pageNum === currentPage 
                        ? 'bg-primary text-primary-foreground' 
                        : pageNum === '...' 
                          ? 'cursor-default' 
                          : 'hover:bg-muted'
                    }`}
                    disabled={pageNum === '...'}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
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
