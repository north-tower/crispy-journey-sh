import apiClient from "@/lib/axios";
import { useCategoriesStore } from "@/lib/store/categories";
import { useEffect, useState } from "react";

interface FormData {
  name: string;
  description: string;
  stock: number;
  categoryId: string;
  markedPrice: number;
  sellingPrice: number;
  sellerId?: string;
  imageIds?: string[];
}

interface NewProductFormProps {
  onSubmit: () => Promise<void>; // Async handler for the form submission.
  onCancel: () => void; // Handler to cancel form submission.
}

type Section = "basic" | "pricing" | "media";

export function NewProductForm({ onSubmit, onCancel }: NewProductFormProps) {
  const { categories, isLoading, error, fetchCategories } =
    useCategoriesStore();
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  const [currentSection, setCurrentSection] = useState<Section>("basic");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    markedPrice: 0,
    sellingPrice: 0,
    stock: 0,
    categoryId: "",
    imageIds: [],
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]); // Store files before upload.
  const [uploading, setUploading] = useState(false); // Track upload progress.

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadedFiles(Array.from(files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Step 1: Create the product without images
      const productResponse = await apiClient.post(
        "http://localhost:8900/api/products",
        {
          ...formData,
          imageIds: [], // Initially, no images
        }
      );

      const productId = productResponse.data.id;

      // Step 2: Upload images with productId
      const uploadedIds: string[] = [];
      for (const file of uploadedFiles) {
        const fileData = new FormData();
        fileData.append("file", file);
        fileData.append("purpose", "PRODUCT");
        fileData.append("productId", productId); // Now include the productId

        const uploadResponse = await apiClient.post(
          "http://localhost:8900/api/media/upload",
          fileData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        const uploadedFile = uploadResponse.data;
        if (!uploadedFile.id) {
          throw new Error("File upload failed. Missing file ID.");
        }
        uploadedIds.push(uploadedFile.id);
      }

      // Step 3: Update the product with the uploaded image IDs
      await apiClient.patch(`http://localhost:8900/api/products/${productId}`, {
        imageIds: uploadedIds,
      });

      await onSubmit();
    } catch (error: any) {
      console.error(
        "Error submitting product form:",
        error.response ? error.response.data : error.message
      );
      // alert("Failed to save product. Please check the details and try again.");
    } finally {
      setUploading(false);
    }
  };

  const renderContent = () => {
    switch (currentSection) {
      case "basic":
        return (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Category</label>
              {isLoading ? (
                <div className="w-full rounded-lg border px-3 py-2 text-sm text-gray-500">
                  Loading categories...
                </div>
              ) : error ? (
                <div className="w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                  <button
                    onClick={fetchCategories}
                    className="ml-2 text-red-700 underline"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                required
              />
            </div>
          </div>
        );

      case "pricing":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Marked Price</label>
                <input
                  type="number"
                  name="markedPrice" // Corrected name
                  value={formData.markedPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Selling Price</label>
                <input
                  type="number"
                  name="sellingPrice" // Corrected name
                  value={formData.sellingPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Stock</label>
                <input
                  type="number"
                  name="stock" // Correct name
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                  required
                />
              </div>
            </div>
          </div>
        );

      case "media":
        return (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Product Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelection}
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-100"
              />
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <p>Selected Images:</p>
                <ul>
                  {uploadedFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex gap-6">
      <div className="w-48 space-y-1">
        {[
          { id: "basic", label: "Basic Information" },
          { id: "pricing", label: "Pricing & Inventory" },
          { id: "media", label: "Media" },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setCurrentSection(id as Section)}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              currentSection === id
                ? "bg-primary-50 text-primary-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1">
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderContent()}

          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary-400 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
