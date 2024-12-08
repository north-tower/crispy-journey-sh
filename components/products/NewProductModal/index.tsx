import { Product } from "@/types/products";
import { Modal } from "./Modal";
import { NewProductForm } from "./NewProductForm";

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Product, "id" | "createdAt">) => void;
}

export function NewProductModal({
  isOpen,
  onClose,
  onSubmit,
}: NewProductModalProps) {
  const handleSubmit = async (data: Omit<Product, "id" | "createdAt">) => {
    try {
      // Submit the final data
      await onSubmit(data); // Pass form data directly
      onClose(); // Close the modal on success
    } catch (error) {
      console.error("Error creating product:", error);
      // Optionally: Handle error display (e.g., show error notification)
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Product">
      <NewProductForm onSubmit={handleSubmit} onCancel={onClose} />
    </Modal>
  );
}
