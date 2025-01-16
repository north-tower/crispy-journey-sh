import apiClient from '@/lib/axios';

export const API_BASE_URL = 'http://16.16.68.79:8900/api'; // Replace with your actual API base URL

export const createProduct = async (productData: any) => {
  const response = await apiClient.post(`${API_BASE_URL}/products`, productData);
  return response.data;
};

export const fetchProductsAPI = async () => {
  const response = await apiClient.get(`${API_BASE_URL}/products`);
  return response.data;
};