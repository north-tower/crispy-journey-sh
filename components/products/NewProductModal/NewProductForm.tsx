// components/products/NewProductModal/NewProductForm.tsx
import { MOCK_CATEGORIES } from "@/types/categories";
import { Product } from "@/types/products";
import { useState } from "react";

interface FormData extends Omit<Product, "id" | "createdAt"> {
  status: "in_stock" | "low_stock" | "out_of_stock";
}

interface NewProductFormProps {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

type Section = "basic" | "pricing" | "media";

export function NewProductForm({ onSubmit, onCancel }: NewProductFormProps) {
  const [currentSection, setCurrentSection] = useState<Section>("basic");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    status: "in_stock",
    imageUrl: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In real app, handle file upload here
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, imageUrl }));
    }
  };

  const sections = [
    { id: "basic", label: "Basic Information", icon: "📝" },
    { id: "pricing", label: "Pricing & Inventory", icon: "💰" },
    { id: "media", label: "Media", icon: "🖼️" },
  ] as const;

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
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                required
              >
                <option value="">Select a category</option>
                {MOCK_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
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
                <label className="text-sm font-medium">Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full rounded-lg border pl-8 pr-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
              >
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>
        );

      case "media":
        return (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-100"
              />
            </div>

            {formData.imageUrl && (
              <div className="relative h-40 w-40 overflow-hidden rounded-lg border">
                <img
                  src={formData.imageUrl}
                  alt="Product preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <div className="w-48 space-y-1">
        {sections.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setCurrentSection(id)}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              currentSection === id
                ? "bg-primary-50 text-primary-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="flex items-center gap-2">
              <span>{icon}</span>
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
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
            >
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
