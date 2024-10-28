// components/common/Pagination.tsx
import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  boundaryCount?: number;
  showFirstLast?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "simple" | "detailed";
  totalItems?: number;
  itemsPerPage?: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  showFirstLast = true,
  disabled = false,
  size = "md",
  variant = "detailed",
  totalItems,
  itemsPerPage,
  className = "",
}: PaginationProps) {
  // Generate page numbers to show
  const pageNumbers = useMemo(() => {
    const range = (start: number, end: number) => {
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    // Calculate ranges
    const startPages = range(1, Math.min(boundaryCount, totalPages));
    const endPages = range(
      Math.max(totalPages - boundaryCount + 1, boundaryCount + 1),
      totalPages
    );

    const siblingsStart = Math.max(
      Math.min(
        currentPage - siblingCount,
        totalPages - boundaryCount - siblingCount * 2 - 1
      ),
      boundaryCount + 2
    );

    const siblingsEnd = Math.min(
      Math.max(
        currentPage + siblingCount,
        boundaryCount + siblingCount * 2 + 2
      ),
      endPages.length > 0 ? endPages[0] - 2 : totalPages - 1
    );

    const itemList = [
      ...startPages,
      ...(siblingsStart > boundaryCount + 2
        ? ["ellipsis"]
        : boundaryCount + 1 < totalPages - boundaryCount
        ? [boundaryCount + 1]
        : []),
      ...range(siblingsStart, siblingsEnd),
      ...(siblingsEnd < totalPages - boundaryCount - 1
        ? ["ellipsis"]
        : totalPages - boundaryCount > boundaryCount
        ? [totalPages - boundaryCount]
        : []),
      ...endPages,
    ];

    return itemList;
  }, [currentPage, totalPages, siblingCount, boundaryCount]);

  // Size configurations
  const sizeClasses = {
    sm: {
      button: "h-8 w-8 text-sm",
      text: "text-sm",
    },
    md: {
      button: "h-10 w-10 text-sm",
      text: "text-sm",
    },
    lg: {
      button: "h-12 w-12 text-base",
      text: "text-base",
    },
  };

  // Calculate item ranges for detailed view
  const startItem = (currentPage - 1) * (itemsPerPage || 0) + 1;
  const endItem = Math.min(currentPage * (itemsPerPage || 0), totalItems || 0);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
    >
      {/* Detailed View Information */}
      {variant === "detailed" && totalItems && itemsPerPage && (
        <div className={`text-gray-500 ${sizeClasses[size].text}`}>
          Showing <span className="font-medium text-gray-900">{startItem}</span>{" "}
          to <span className="font-medium text-gray-900">{endItem}</span> of{" "}
          <span className="font-medium text-gray-900">{totalItems}</span>{" "}
          results
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* First Page Button */}
        {showFirstLast && (
          <motion.button
            whileHover={!disabled ? { scale: 1.05 } : undefined}
            whileTap={!disabled ? { scale: 0.95 } : undefined}
            onClick={() => !disabled && onPageChange(1)}
            disabled={disabled || currentPage === 1}
            className={`
              ${sizeClasses[size].button}
              flex items-center justify-center rounded-lg
              ${
                disabled || currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }
              transition-colors
            `}
            aria-label="First page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </motion.button>
        )}

        {/* Previous Page Button */}
        <motion.button
          whileHover={!disabled ? { scale: 1.05 } : undefined}
          whileTap={!disabled ? { scale: 0.95 } : undefined}
          onClick={() => !disabled && onPageChange(currentPage - 1)}
          disabled={disabled || currentPage === 1}
          className={`
            ${sizeClasses[size].button}
            flex items-center justify-center rounded-lg
            ${
              disabled || currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }
            transition-colors
          `}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>

        {/* Page Numbers */}
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {pageNumbers.map((pageNumber, index) => {
              if (pageNumber === "ellipsis") {
                return (
                  <div
                    key={`ellipsis-${index}`}
                    className="flex items-center justify-center"
                  >
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </div>
                );
              }

              return (
                <motion.button
                  key={pageNumber}
                  whileHover={!disabled ? { scale: 1.05 } : undefined}
                  whileTap={!disabled ? { scale: 0.95 } : undefined}
                  onClick={() =>
                    !disabled && onPageChange(pageNumber as number)
                  }
                  disabled={disabled}
                  className={`
                    ${sizeClasses[size].button}
                    flex items-center justify-center rounded-lg
                    ${
                      currentPage === pageNumber
                        ? "bg-primary-50 text-primary-600 font-medium border border-primary-100"
                        : disabled
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }
                    transition-colors
                  `}
                  aria-label={`Page ${pageNumber}`}
                  aria-current={currentPage === pageNumber ? "page" : undefined}
                >
                  {pageNumber}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Next Page Button */}
        <motion.button
          whileHover={!disabled ? { scale: 1.05 } : undefined}
          whileTap={!disabled ? { scale: 0.95 } : undefined}
          onClick={() => !disabled && onPageChange(currentPage + 1)}
          disabled={disabled || currentPage === totalPages}
          className={`
            ${sizeClasses[size].button}
            flex items-center justify-center rounded-lg
            ${
              disabled || currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }
            transition-colors
          `}
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>

        {/* Last Page Button */}
        {showFirstLast && (
          <motion.button
            whileHover={!disabled ? { scale: 1.05 } : undefined}
            whileTap={!disabled ? { scale: 0.95 } : undefined}
            onClick={() => !disabled && onPageChange(totalPages)}
            disabled={disabled || currentPage === totalPages}
            className={`
              ${sizeClasses[size].button}
              flex items-center justify-center rounded-lg
              ${
                disabled || currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }
              transition-colors
            `}
            aria-label="Last page"
          >
            <ChevronsRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </div>
  );
}

// Optional: Simple Pagination for mobile or simplified views
export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
  className = "",
}: Omit<PaginationProps, "variant" | "size">) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <button
        onClick={() => !disabled && onPageChange(currentPage - 1)}
        disabled={disabled || currentPage === 1}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg
          ${
            disabled || currentPage === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          }
          transition-colors
        `}
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <span className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => !disabled && onPageChange(currentPage + 1)}
        disabled={disabled || currentPage === totalPages}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg
          ${
            disabled || currentPage === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          }
          transition-colors
        `}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
