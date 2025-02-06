import apiClient from '@/lib/axios';

export const API_BASE_URL = 'http://13.50.4.62:8900/api'; // Replace with your actual API base URL

export const createProduct = async (productData: any) => {
  const response = await apiClient.post(`${API_BASE_URL}/products`, productData);
  return response.data;
};

export const fetchProductsAPI = async (params: {
  page?: number;
  limit?: number;
  category?: string;
  
}) => {
  const response = await apiClient.get(`${API_BASE_URL}/products`, { params });
  return response.data;
};