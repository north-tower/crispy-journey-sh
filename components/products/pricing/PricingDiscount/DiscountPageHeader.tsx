// DiscountPageHeader.tsx
import React, { useState } from "react";
import { Search, Plus, Filter, Grid, Table } from "lucide-react";
import { NewProductModal } from "../../NewProductModal";

interface DiscountPageHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isTableView: boolean;
  setIsTableView: (view: boolean) => void;
  toggleFilterModal: () => void;
  openAddProductModal: () => void;
}

const DiscountPageHeader: React.FC<DiscountPageHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  isTableView,
  setIsTableView,
  toggleFilterModal,
 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (data) => {
    // TODO: Handle the new product data here
    console.log("New product:", data);
    //TODO: API call or state management logic
  };


  return (
    <>
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
        <button  onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-primary-500 text-white rounded-full shadow-md hover:bg-primary-600">
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
    <NewProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
    
  );
};

export default DiscountPageHeader;
