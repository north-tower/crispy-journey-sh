// src/services/categories.ts

import { Category } from "@/types/categories";
import { api } from "../axios";

export const categoriesService = {
  getAll: () => api.get<Category[]>("/categories"),

  getById: (id: string) => api.get<Category>(`/categories/${id}`),

  create: (data: Partial<Category>) => api.post<Category>("/categories", data),

  update: (id: string, data: Partial<Category>) =>
    api.patch<Category>(`/categories/${id}`, data),

  delete: (id: string) => api.delete<void>(`/categories/${id}`),
};
