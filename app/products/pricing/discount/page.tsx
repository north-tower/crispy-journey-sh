// DiscountPage.tsx
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import DiscountedProductsTable from "@/components/products/pricing/PricingDiscount/DiscountedProductsTable";
import DiscountedProductsGrid from "@/components/products/pricing/PricingDiscount/DiscountedProductsGrid";
import { products } from "@/types/products";
import { Search, Table, Grid, Plus, AlertCircle, Filter } from "lucide-react";

function Page() {
  const [isTableView, setIsTableView] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState<{ status?: string; salesPotential?: string; minProfitMargin?: number }>({});
  const [tempFilter, setTempFilter] = useState<{ status?: string; salesPotential?: string; minProfitMargin?: number }>({});

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setIsTableView(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleFilterModal = () => setIsFilterOpen(!isFilterOpen);

  const applyFilter = () => {
    setFilter(tempFilter);
    setIsFilterOpen(false);
  };

  const getSalesPotential = (stock: number, price: number) => {
    if (stock > 50 && price < 100) return "High Potential";
    if (stock > 20 && stock <= 50) return "Moderate Potential";
    return "Low Potential";
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const profitMargin = ((product.price - product.discountedPrice) / product.price) * 100;
      if (filter.status && product.status !== filter.status) return false;
      if (filter.salesPotential && getSalesPotential(product.stock, product.discountedPrice) !== filter.salesPotential) return false;
      if (filter.minProfitMargin !== undefined && profitMargin < filter.minProfitMargin) return false;
      return product.name.toLowerCase().includes(debouncedQuery.toLowerCase());
    });
  }, [debouncedQuery, filter]);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-center px-4">
        <h1 className="text-2xl font-bold text-foreground">Discounted Products</h1>
        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end w-full mt-4 md:mt-0 space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center w-full sm:w-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 rounded-full w-full sm:w-64 border border-gray-300 bg-white pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300"
            />
          </div>
          <button onClick={toggleFilterModal} className="hover:bg-primary-600 hover:text-white text-gray-400 p-2 rounded-full">
            <Filter size={18} />
          </button>
          <button
            onClick={() => console.log("Add Product Clicked")}
            className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-primary-500 text-white rounded-full shadow-md hover:bg-primary-600"
          >
            <Plus className="mr-2" />
            <span className="hidden sm:inline">Add Product</span>
          </button>
          <button
            onClick={() => setIsTableView(!isTableView)}
            className="hidden sm:flex bg-primary-500 text-white p-2 rounded-md shadow-md hover:bg-primary-600"
          >
            {isTableView ? <Grid /> : <Table />}
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 space-y-4">
            <h3 className="text-lg font-semibold">Filter Options</h3>
            <div>
              <label className="text-sm">Stock Status:</label>
              <select
                className="w-full p-2 mt-1 border rounded-full"
                onChange={(e) => setTempFilter({ ...tempFilter, status: e.target.value || undefined })}
                value={tempFilter.status || ""}
              >
                <option value="">All</option>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
            <div>
              <label className="text-sm">Sales Potential:</label>
              <select
                className="w-full p-2 mt-1 border rounded-full"
                onChange={(e) => setTempFilter({ ...tempFilter, salesPotential: e.target.value || undefined })}
                value={tempFilter.salesPotential || ""}
              >
                <option value="">All</option>
                <option value="High Potential">High Potential</option>
                <option value="Moderate Potential">Moderate Potential</option>
                <option value="Low Potential">Low Potential</option>
              </select>
            </div>
            <div>
              <label className="text-sm">Min Profit Margin (%):</label>
              <input
                type="number"
                className="w-full p-2 mt-1 border rounded-full"
                placeholder="e.g., 10"
                onChange={(e) => setTempFilter({ ...tempFilter, minProfitMargin: e.target.value ? parseFloat(e.target.value) : undefined })}
                value={tempFilter.minProfitMargin || ""}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsFilterOpen(false)} className="px-4 py-2 bg-gray-300 rounded-full">
                Cancel
              </button>
              <button onClick={applyFilter} className="px-4 py-2 bg-primary-600 text-white rounded-full">
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          No products found
        </div>
      ) : isTableView ? (
        <DiscountedProductsTable items={filteredProducts} />
      ) : (
        <DiscountedProductsGrid items={filteredProducts} />
      )}
    </DashboardLayout>
  );
}

export default Page;
