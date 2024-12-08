import { useState } from "react";
import { motion } from "framer-motion";
import { SearchBar } from "./SearchBar";
import { ViewToggle } from "./ViewToggle";
import { NewProductModal } from "./NewProductModal";
import { toast } from "react-toastify"; 


interface ProductHeaderProps {
  viewMode: "table" | "grid";
  onViewModeChange: (mode: "table" | "grid") => void;
  onSearch: (query: string) => void;
  onProductCreated: () => void; // Callback to trigger data reload in parent
}

export function ProductHeader({
  viewMode,
  onViewModeChange,
  onSearch,
  onProductCreated,
}: ProductHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async () => {
    try {
     
      // Show success notification
      toast.success("Product created successfully!");
      
      // Close modal on success
      setIsModalOpen(false);
      
      // Trigger a refresh in the parent component to fetch updated data
      onProductCreated();
      
    } catch (error) {
      // Handle errors
      console.error("Error creating product:", error);
      toast.error("Failed to create product. Please try again.");
    }
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
          <SearchBar onSearch={onSearch} />
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
