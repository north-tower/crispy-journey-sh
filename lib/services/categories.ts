// src/services/categories.ts

import { Category } from "@/types/categories";
import { api } from "../axios";
import { API_BASE_URL } from "@/services/products";



export const categoriesService = {
  getAll: () => api.get<Category[]>(`${API_BASE_URL}/categories`),

  getById: (id: string) => api.get<Category>(`${API_BASE_URL}/categories/${id}`),

  create: (data: Partial<Category>) => api.post<Category>(`${API_BASE_URL}/categories`, data),

  update: (id: string, data: Partial<Category>) =>
    api.patch<Category>(`${API_BASE_URL}/categories/${id}`, data),

  delete: (id: string) => api.delete<void>(`${API_BASE_URL}/categories/${id}`),
};
