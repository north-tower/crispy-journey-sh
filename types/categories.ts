// components/products/NewProductModal/categories.ts
export const MOCK_CATEGORIES = [
  { id: "9752452d-a7ae-11ef-93d1-d4d252d1dd96", name: "Electronics" },
  { id: "97524e98-a7ae-11ef-93d1-d4d252d1dd96", name: "Clothing" },
  { id: "975256c3-a7ae-11ef-93d1-d4d252d1dd96", name: "Books" },
  { id: "9752526e-a7ae-11ef-93d1-d4d252d1dd96", name: "Home & Garden" },

  { id: "97525e9c-a7ae-11ef-93d1-d4d252d1dd96", name: "Toys" },

];


// src/types/api.ts
export interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}