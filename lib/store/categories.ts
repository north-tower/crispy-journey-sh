// src/stores/categories.ts
import { create } from "zustand";
import { categoriesService } from "../services/categories";
import { Category } from "@/types/categories";

interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('Fetching categories...'); // Debug log
      const categories = await categoriesService.getAll();
      console.log('Fetched categories:', categories); // Debug log
      set({ categories, isLoading: false });
    } catch (error) {
      console.error('Error fetching categories:', error); // Debug log
      set({ 
        error: error.message || 'Failed to fetch categories',
        isLoading: false 
      });
    }
  },
}));
