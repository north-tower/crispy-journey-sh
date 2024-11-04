// Page.tsx

"use client";
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import DiscountedProductsTable from "@/components/products/pricing/PricingDiscount/DiscountedProductsTable";
import DiscountedProductsGrid from "@/components/products/pricing/PricingDiscount/DiscountedProductsGrid";
import { products } from "@/types/products";
import { Search, Table, Grid, Plus, Fuel, AlertCircle, Filter } from "lucide-react";

function Page() {
  const [isTableView, setIsTableView] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState<{ status?: string; salesPotential?: string; minProfitMargin?: number }>({});

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setIsTableView(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle Filter Modal
  const toggleFilterModal = () => setIsFilterOpen(!isFilterOpen);

  const applyFilter = () => {
    setIsFilterOpen(false);
  };

  // Filtered Products
  const filteredProducts = products.filter((product) => {
    const profitMargin = ((product.price - product.discountedPrice) / product.price) * 100;
    if (filter.status && product.status !== filter.status) return false;
    if (filter.salesPotential && getSalesPotential(product.stock, product.discountedPrice) !== filter.salesPotential) return false;
    if (filter.minProfitMargin !== undefined && profitMargin < filter.minProfitMargin) return false;
    return product.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getSalesPotential = (stock: number, price: number) => {
    if (stock > 50 && price < 100) return "High Potential";
    if (stock > 20 && stock <= 50) return "Moderate Potential";
    return "Low Potential";
  };

  return (
    <DashboardLayout>
      {/* Title and Control Panel */}
      <div className="flex flex-col md:flex-row justify-between items-center px-4">
        <h1 className="text-2xl font-bold text-foreground">Discounted Products</h1>

        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end w-full mt-4 md:mt-0 space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Search Bar */}
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

          {/* Filter Button */}
          <button onClick={toggleFilterModal} className=" hover:bg-primary-600 hover:text-white text-gray-400 p-2 rounded-full">
          
            <Filter  size={18} />
          </button>

          {/* Add Product Button */}
          <button
            onClick={() => console.log("Add Product Clicked")}
            className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-primary-500 text-white rounded-full shadow-md hover:bg-primary-600 transition duration-200"
          >
            <Plus className="mr-2" />
            <span className="hidden sm:inline">Add Product</span>
          </button>

          {/* Toggle View Button */}
          <button
            onClick={() => setIsTableView(!isTableView)}
            className="hidden sm:flex bg-primary-500 text-white p-2 rounded-md shadow-md hover:bg-primary-600 transition duration-200"
          >
            {isTableView ? <Grid /> : <Table />}
          </button>
        </div>
      </div>

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-primary-50 p-6 rounded-lg w-80 space-y-4">
            <h3 className="text-lg font-semibold">Filter Options</h3>
            <div>
              <label className="text-sm">Stock Status:</label>
              <select
                className="w-full p-2 mt-1 border rounded-full"
                onChange={(e) => setFilter({ ...filter, status: e.target.value || undefined })}
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
                onChange={(e) => setFilter({ ...filter, salesPotential: e.target.value || undefined })}
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
                onChange={(e) => setFilter({ ...filter, minProfitMargin: e.target.value ? parseFloat(e.target.value) : undefined })}
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

      {/* Display Message or Products */}
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
