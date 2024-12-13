// components/dashboard/analytics/TopProducts.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  ArrowRight,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react";
import { ProductPerformance } from "@/types/dashboard";
import { formatCurrency, formatNumber } from "@/lib/utils/charts";

interface TopProductsProps {
  products?: ProductPerformance[];
  className?: string;
}

export function TopProducts({
  products = [],
  className = "",
}: TopProductsProps) {
  const [sortBy, setSortBy] = useState<"revenue" | "sales">("revenue");
  const [searchTerm, setSearchTerm] = useState("");
  const [showOptions, setShowOptions] = useState<string | null>(null);

  // Handle empty products array
  if (!products || products.length === 0) {
    return (
      <div
        className={`bg-white rounded-2xl border border-gray-100 p-6 ${className}`}
      >
        <div className="flex flex-col items-center justify-center h-[400px] text-center">
          <div className="p-3 bg-gray-50 rounded-full mb-3">
            <TrendingUp className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Products Available
          </h3>
          <p className="text-gray-500 text-sm">
            There are no products to display at the moment.
          </p>
        </div>
      </div>
    );
  }

  const sortedProducts = [...products]
    .filter((product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 p-6 ${className}`}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Best Performing Products
            </h3>
            <p className="text-sm text-gray-500">
              {products.length} products sorted by{" "}
              {sortBy === "revenue" ? "revenue" : "sales"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 w-[200px]
                transition-all duration-200 hover:border-gray-200 focus:border-primary-100"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {/* Sort Toggle */}
            <div className="flex p-1 bg-gray-50 rounded-xl">
              <button
                onClick={() => setSortBy("revenue")}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200
                  ${
                    sortBy === "revenue"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Revenue
              </button>
              <button
                onClick={() => setSortBy("sales")}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200
                  ${
                    sortBy === "sales"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Sales
              </button>
            </div>
          </div>
        </div>

        {/* Products List */}
        {sortedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500">
              No products found matching your search.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
  {sortedProducts.map((product, index) => (
    <motion.div
      key={product.id || `${product.productName}-${index}`} // Fallback to unique key
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative group"
    >
      <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200">
        {/* Product Image/Placeholder */}
        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.productName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-lg font-medium text-gray-400">
              {product.productName.charAt(0)}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">
              {product.productName}
            </h4>
            <button
              onClick={() =>
                setShowOptions(showOptions === product.id ? null : product.id)
              }
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-sm text-gray-500">
              Revenue: {formatCurrency(product.sales)}
            </span>
            <span className="text-sm text-gray-500">
              Sales: {formatNumber(product.sales)}
            </span>
            <div
              className={`flex items-center gap-1 text-sm ${
                product.trend > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.trend > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {Math.abs(product.trend)}%
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Options Dropdown */}
        <AnimatePresence>
          {showOptions === product.id && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-4 top-12 w-48 bg-white rounded-xl shadow-lg border border-gray-100 p-2 z-10"
            >
              <div className="space-y-1">
                {["View Details", "Edit Product", "View Analytics"].map(
                  (action) => (
                    <button
                      key={`${product.id}-${action}`} // Ensures unique keys for dropdown items
                      className="w-full px-3 py-2 text-sm text-left text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {action}
                    </button>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  ))}
</div>

        )}
      </div>
    </div>
  );
}
