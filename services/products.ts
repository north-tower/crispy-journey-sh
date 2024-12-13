import apiClient from '@/lib/axios';

const API_BASE_URL = 'http://localhost:8900/api'; // Replace with your actual API base URL

export const createProduct = async (productData: any) => {
  const response = await apiClient.post(`http://localhost:8900/api/products`, productData);
  return response.data;
};

export const fetchProductsAPI = async () => {
  const response = await apiClient.get(`http://localhost:8900/api/products`);
  return response.data;
};