"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/types/products";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  // Adjust items per page based on screen size
  const getItemsPerPage = () => {
    if (typeof window === "undefined") return 8;
    if (window.innerWidth < 640) return 4; // mobile
    if (window.innerWidth < 1024) return 6; // tablet
    return 8; // desktop
  };

  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());

  // Update items per page on window resize
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerPage());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  // Calculate pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
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
    <div className="space-y-6">
      {/* <AnimatePresence mode="wait"> */}
      <div
        key={currentPage}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {currentProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: index * 0.1 },
            }}
            onClick={() => handleProductClick(product.id)}
            className="group cursor-pointer"
          >
            <div className="rounded-lg border border-border overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary-200">
              <div className="aspect-square bg-muted relative overflow-hidden">
                <img
                  src={`http://localhost:8900/uploads/${product.images?.[0]?.filename}`}
                  alt={product.name}
                  className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-4">
                <h3 className="font-medium group-hover:text-primary-600 transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {product.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-medium text-primary-600">
                    KES{product.sellingPrice}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
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
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* </AnimatePresence> */}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          Showing {startIndex + 1} to {Math.min(endIndex, products.length)} of{" "}
          {products.length} products
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Desktop pagination numbers */}
          <div className="hidden sm:flex gap-1">
            {getPageNumbers().map((pageNum, index) => (
              <button
                key={index}
                onClick={() =>
                  typeof pageNum === "number" && setCurrentPage(pageNum)
                }
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  pageNum === currentPage
                    ? "bg-primary text-primary-foreground"
                    : pageNum === "..."
                    ? "cursor-default"
                    : "hover:bg-muted"
                }`}
                disabled={pageNum === "..."}
                aria-label={`Page ${pageNum}`}
                aria-current={pageNum === currentPage ? "page" : undefined}
              >
                {pageNum}
              </button>
            ))}
          </div>

          {/* Mobile page indicator */}
          <span className="sm:hidden text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile quick jump to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-4 right-4 sm:hidden bg-primary text-primary-foreground rounded-full p-3 shadow-lg"
        aria-label="Scroll to top"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
}
