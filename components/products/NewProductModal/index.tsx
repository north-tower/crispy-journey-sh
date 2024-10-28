// components/products/NewProductModal/index.tsx
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
      // Handle file upload if there's a file
      if (data.imageUrl instanceof File) {
        const reader = new FileReader();
        const imageUrl = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(data.imageUrl as unknown as File);
        });

        // Update the data with the image URL
        data = {
          ...data,
          imageUrl,
        };
      }

      // Submit the final data
      onSubmit(data);
      onClose();
    } catch (error) {
      console.error("Error processing product data:", error);
      // Here you might want to show an error message to the user
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Product">
      <NewProductForm onSubmit={handleSubmit} onCancel={onClose} />
    </Modal>
  );
}
