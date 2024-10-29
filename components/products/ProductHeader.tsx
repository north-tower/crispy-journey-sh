// components/products/ProductHeader.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SearchBar } from "./SearchBar";
import { ViewToggle } from "./ViewToggle";
import { NewProductModal } from "./NewProductModal";

interface ProductHeaderProps {
  viewMode: "table" | "grid";
  onViewModeChange: (mode: "table" | "grid") => void;
  onSearch: (query: string) => void;  // Add prop for search query
}

export function ProductHeader({
  viewMode,
  onViewModeChange,
  onSearch,
}: ProductHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (data: any) => {
    // TODO: Handle the new product data here
    console.log("New product:", data);
    //TODO: API call or state management logic
  };

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage and view all your products
          </p>
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-full font-medium"
          >
            New Product
          </motion.button>
          <SearchBar onSearch={onSearch} />  {/* Pass onSearch to SearchBar */}
          <ViewToggle currentView={viewMode} onViewChange={onViewModeChange} />
        </div>
      </div>

      <NewProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
