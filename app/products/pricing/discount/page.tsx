'use client'

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import DiscountedProductsTable from '@/components/products/pricing/PricingDiscount/DiscountedProductsTable';
import DiscountedProductsGrid from '@/components/products/pricing/PricingDiscount/DiscountedProductsGrid';
import { products } from '@/types/products';
import { Search, Table, Grid, Plus, AlertCircle } from 'lucide-react';

function Page() {
  const [isTableView, setIsTableView] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsTableView(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      {/* Title and Control Panel */}
      <div className="flex flex-col md:flex-row justify-between items-center px-4">
        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground">Discounted Products</h1>

        {/* Search and Actions */}
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

          {/* Add Product Button */}
          <button
            onClick={() => console.log('Add Product Clicked')}
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

      {/* Display Message or Products */}
      {filteredProducts.length === 0 ? (
         <div className="p-4 text-center text-muted-foreground">
         <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
         No products found
       </div>
      ) : (
        isTableView ? (
          <DiscountedProductsTable items={filteredProducts} />
        ) : (
          <DiscountedProductsGrid items={filteredProducts} />
        )
      )}
    </DashboardLayout>
  );
}

export default Page;

